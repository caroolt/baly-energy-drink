import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { flavors, productPath } from './flavors';
import { artMarkup } from './art';
import { createFlavorSlider } from './slider';
import { runPreloader } from './preloader';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// A reload must start from the top: restoring a scroll position inside pinned scenes before
// ScrollTrigger builds its spacers leaves the layout scrambled until everything refreshes.
// ScrollTrigger keeps its own scroll memory, so it has to be told (plain history.scrollRestoration is reset).
ScrollTrigger.clearScrollMemory('manual');
if (!location.hash) window.scrollTo(0, 0);

// Inline icons avoid missing Unicode glyphs on minimal cloud/mobile font stacks.
document.querySelectorAll<HTMLElement>('.pill-link span, .text-link span, .back-top span, .arrow-button span').forEach(icon => {
  const direction = icon.textContent?.trim();
  const rotation = direction === '↗' ? -45 : direction === '↘' ? 45 : direction === '↓' ? 90 : direction === '↑' ? -90 : direction === '←' ? 180 : 0;
  icon.innerHTML = `<svg viewBox="0 0 32 32" width="1em" height="1em" fill="none" aria-hidden="true" style="transform:rotate(${rotation}deg)"><path d="M5 16H27M17 6L27 16L17 26" stroke="currentColor" stroke-width="1.6"/></svg>`;
});

const scenes = document.querySelector<HTMLElement>('#flavor-scenes')!;
scenes.innerHTML = flavors.map((flavor, index) => `
  <article class="flavor-scene" data-scene="${flavor.id}" role="group" aria-roledescription="slide" aria-label="${index + 1} de 7: ${flavor.name}" ${index ? 'hidden inert' : ''} style="--ink:${flavor.ink};--accent:${flavor.accent};--tilt:${flavor.tilt}deg">
    <div class="flavor-word ${flavor.display.length > 10 ? 'long-word' : ''}" aria-hidden="true">${flavor.display}</div>
    <div class="scene-art" aria-hidden="true">${artMarkup()}</div>
    <div class="scene-copy"><h2>${flavor.headline}</h2><p class="scene-desc">${flavor.description}</p>
      <ul class="scene-chips" aria-label="Tamanhos e opções">${flavor.sizes.map(size => `<li>${size}</li>`).join('')}${flavor.zero ? '<li class="chip-zero">Zero açúcar</li>' : ''}</ul>
      <p class="scene-facts">Cafeína ${flavor.caffeine} · Taurina ${flavor.taurine} <span>(${flavor.per})</span><br />Produto não alcoólico</p></div>
    <div class="scene-product product-slot" data-product="${flavor.id}"><img ${index ? 'data-src' : 'src'}="${productPath(flavor.id)}" alt="Lata BALY ${flavor.name}" width="1086" height="1448" loading="lazy" decoding="async" /></div>
  </article>
`).join('');

// Manifesto words are split so scroll can light them up one by one (the strike SVG is left alone).
const manifesto = document.querySelector<HTMLElement>('#manifesto-title')!;
const splitWords = (element: Element) => {
  Array.from(element.childNodes).forEach(node => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent!.trim()) {
      const holder = document.createElement('span');
      holder.innerHTML = node.textContent!.replace(/\S+/g, word => `<span class="m-word">${word}</span>`);
      node.replaceWith(...holder.childNodes);
    } else if (node instanceof HTMLElement) splitWords(node);
  });
};
splitWords(manifesto);

// All seven cans fly through the pinned manifesto, alternating sides.
const canLanes = ['72%', '4%', '84%', '16%', '64%', '0%', '78%'];
document.querySelector('.m-cans')!.innerHTML = flavors.map((flavor, index) => `<div class="m-can product-slot" style="left:${canLanes[index]}"><img data-src="${productPath(flavor.id)}" alt="" width="1086" height="1448" loading="lazy" decoding="async" /></div>`).join('');

document.querySelector('#flavor-index')!.innerHTML = flavors.map((flavor, index) => `<button type="button" data-flavor="${flavor.id}" aria-label="Explorar ${flavor.name}" aria-current="${index === 0}"></button>`).join('');

const rotations = [-15, -10, -5, 0, 5, 10, 15];
const offsets = [22, 5, -10, -22, -10, 5, 22];
document.querySelector('#lineup')!.innerHTML = flavors.map((flavor, index) => `<button class="lineup-item product-slot" type="button" data-revisit="${index}" data-product="${flavor.id}" aria-label="Revisitar ${flavor.name}" style="--rotation:${rotations[index]}deg;--offset:${offsets[index]}px"><img data-src="${productPath(flavor.id)}" alt="" width="1086" height="1448" loading="lazy" decoding="async"/><span class="lineup-label">${flavor.name}</span></button>`).join('');

// The UI must never replace missing originals with invented packaging.
const assetListeners = new AbortController();
document.querySelectorAll<HTMLImageElement>('.product-slot img, [data-brand]').forEach(img => {
  const mark = () => img.parentElement?.classList.add('asset-missing');
  img.addEventListener('error', mark, { signal: assetListeners.signal });
  img.addEventListener('load', () => img.parentElement?.classList.remove('asset-missing'), { signal: assetListeners.signal });
  if (img.hasAttribute('src') && img.complete && !img.naturalWidth) mark();
});

const loadImage = (img: HTMLImageElement) => {
  if (!img.dataset.src) return;
  img.loading = 'eager';
  img.src = img.dataset.src;
  delete img.dataset.src;
};
const assetsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll<HTMLImageElement>('img[data-src]').forEach(loadImage);
    assetsObserver.unobserve(entry.target);
  });
}, { rootMargin: '200px' });
assetsObserver.observe(document.querySelector('.lineup')!);
assetsObserver.observe(document.querySelector('.manifesto')!);
assetsObserver.observe(document.querySelector('.numbers')!);

const revealed = runPreloader({
  color: '#141414',
  ready: Promise.all([document.fonts.ready, document.querySelector<HTMLImageElement>('.hero-product img')!.decode()]),
});

const slider = createFlavorSlider(document.querySelector('#sabores')!);
const media = gsap.matchMedia();
let smoother: ScrollSmoother | undefined;
let pin: ScrollTrigger | undefined;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const stepCount = flavors.length - 1;

const scrollToPosition = (top: number) => {
  if (smoother) smoother.scrollTo(top, !reduced.matches);
  else window.scrollTo({ top, behavior: reduced.matches ? 'instant' : 'smooth' });
};
const flavorPosition = (index: number) => pin ? pin.start + (pin.end - pin.start) * (index / stepCount) : 0;

function navigateTo(id: string, focus = false) {
  const target = document.getElementById(id);
  if (!target) return;
  if (id === 'sabores' && pin) scrollToPosition(flavorPosition(0));
  else if (smoother) smoother.scrollTo(target, !reduced.matches, 'top top');
  else target.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'start' });
  if (focus) target.querySelector<HTMLButtonElement>('button[aria-current="true"]')?.focus({ preventScroll: true });
}

const events = new AbortController();
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const id = link.hash.slice(1);
    if (!document.getElementById(id)) return;
    event.preventDefault();
    history.pushState(null, '', `#${id}`);
    navigateTo(id, id === 'sabores');
  }, { signal: events.signal });
});
document.querySelectorAll<HTMLButtonElement>('[data-revisit]').forEach(button => {
  button.addEventListener('click', () => {
    history.pushState(null, '', '#sabores');
    slider.request(Number(button.dataset.revisit));
    if (!pin) navigateTo('sabores', true);
    else button.blur();
  }, { signal: events.signal });
});
window.addEventListener('popstate', () => navigateTo(location.hash.slice(1) || 'inicio'), { signal: events.signal });

media.add({ desktop: '(min-width: 1001px) and (pointer: fine)', motion: '(prefers-reduced-motion: no-preference)' }, context => {
  const { desktop, motion } = context.conditions!;
  if (!motion) return;
  if (desktop) {
    smoother = ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 0.85, effects: false, smoothTouch: 0, normalizeScroll: false });
  }

  // 1. Hero: masked title lines, the can drops in, then everything drifts apart on scroll.
  const intro = gsap.timeline({ defaults: { ease: 'power4.out' }, paused: true });
  void revealed.then(() => intro.play());
  intro
    .from('.hero-title .line > span', { yPercent: 110, duration: 1.1, stagger: 0.12 })
    .from('.hero-disc', { scale: 0, duration: 1.3, ease: 'expo.out' }, 0)
    .from('.hero-product', { yPercent: 14, opacity: 0, duration: 1.2 }, 0.25)
    .from('.hero-dots i', { scale: 0, stagger: 0.06, duration: 0.5, ease: 'back.out(2)' }, 1)
    .from('.hero-bottom', { yPercent: 60, autoAlpha: 0, duration: 0.8 }, 0.8);
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 } })
    .to('.hero-product', { y: desktop ? 140 : 60, rotation: 5, scale: 1.04, ease: 'none' }, 0)
    .to('.hero-disc', { scale: 1.35, y: desktop ? 60 : 30, ease: 'none' }, 0)
    .to('.hero-title', { y: desktop ? -90 : -30, ease: 'none' }, 0)
    .to('.hero-bottom', { opacity: 0, y: -30, ease: 'none', immediateRender: false }, 0);

  // 2. Manifesto: pinned. Words light up, then "um sabor só" is struck out by a line drawn left to right
  //    in step with the scroll, the answer and dots land, and the cans rush through the frame.
  const strike = document.querySelector<SVGPathElement>('.m-line path')!;
  gsap.timeline({ scrollTrigger: { trigger: '.manifesto', start: 'top top', end: () => `+=${innerHeight * 2.2}`, pin: true, scrub: 0.6 } })
    .fromTo('.m-word', { opacity: 0.12 }, { opacity: 1, stagger: 0.12, ease: 'none', duration: 0.4 }, 0)
    .addLabel('strike')
    // Hidden until the stroke starts: an empty dash with a round cap would otherwise show as a dot.
    .set(strike, { opacity: 0, strokeDashoffset: 1 }, 0)
    .set(strike, { opacity: 1 }, 'strike')
    .to(strike, { strokeDashoffset: 0, ease: 'none', duration: 1.1 }, 'strike')
    .to('.m-strike .m-word', { opacity: 0.35, duration: 0.4 }, 'strike+=0.6')
    .from('.m-answer', { yPercent: 60, opacity: 0, duration: 0.5, ease: 'power2.out' }, '>-0.1')
    .from('.m-answer .dots i', { scale: 0, stagger: 0.07, duration: 0.3, ease: 'back.out(2)' }, '<0.2')
    // Each can crosses the full screen in a short slice of the scroll, so they rush past faster than the page moves.
    .fromTo('.m-can', {
      y: () => innerHeight * 1.05,
      rotation: (i: number) => (i % 2 ? -28 : 28),
    }, {
      y: () => -innerHeight * 0.45,
      rotation: (i: number) => (i % 2 ? 14 : -14),
      ease: 'none', duration: 0.8, stagger: 0.38,
    }, 0);

  // 3. Flavor stage: pinned, scroll position chooses the flavor and snaps between them.
  const stage = document.querySelector<HTMLElement>('#sabores')!;
  let shown = 0;
  let jumping: number | null = null;
  let jumpTimer: ReturnType<typeof setTimeout> | undefined;
  const endJump = () => { jumping = null; clearTimeout(jumpTimer); };
  pin = ScrollTrigger.create({
    trigger: stage,
    start: 'top top',
    end: () => `+=${innerHeight * stepCount * 0.75}`,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    snap: { snapTo: 1 / stepCount, duration: { min: 0.2, max: 0.55 }, delay: 0.12, ease: 'power2.inOut' },
    onUpdate: self => {
      const index = Math.round(self.progress * stepCount);
      if (jumping !== null) { if (Math.abs(self.progress * stepCount - jumping) < 0.08) endJump(); return; }
      if (index === shown) return;
      shown = index;
      void slider.select(index);
    },
  });
  // Buttons, keys and swipes scroll to the flavor; the stage follows. Direct jumps skip the flavors in between.
  slider.setDriver(index => {
    shown = index;
    jumping = index;
    clearTimeout(jumpTimer);
    jumpTimer = setTimeout(endJump, 1800);
    void slider.select(index);
    scrollToPosition(flavorPosition(index));
  });
  window.addEventListener('wheel', endJump, { passive: true, signal: events.signal });
  window.addEventListener('touchstart', endJump, { passive: true, signal: events.signal });

  // 4. Numbers: pinned on one black surface. Like a counter, each figure rolls up out of view as the
  //    next rolls in and counts; the sentence rolls with it and only the can beside it changes flavor.
  const numbers = document.querySelector<HTMLElement>('.numbers')!;
  const steps = gsap.utils.toArray<HTMLElement>('.num-step');
  numbers.classList.add('is-pinned');
  const counters = steps.map(step => {
    const number = step.querySelector<HTMLElement>('b')!;
    const target = Number(number.dataset.count);
    const decimals = Number(number.dataset.decimals ?? 0);
    const state = { value: Number(number.dataset.from ?? 0) };
    const render = () => { number.textContent = `${number.dataset.prefix ?? ''}${state.value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: false })}${number.dataset.suffix ?? ''}`; };
    render();
    return { state, target, render };
  });
  const rolls = (step: HTMLElement) => step.querySelectorAll('.num-roll > *');
  const counter = gsap.timeline({ scrollTrigger: { trigger: numbers, start: 'top top', end: () => `+=${innerHeight * steps.length}`, pin: '.num-stage', scrub: 0.6, invalidateOnRefresh: true } });
  steps.forEach((step, i) => {
    const at = i;
    const can = step.querySelector('.num-can');
    if (i) {
      const previous = steps[i - 1];
      counter
        .to(rolls(previous), { yPercent: -135, duration: 0.35, ease: 'power2.in', stagger: 0.05 }, at - 0.1)
        .to(previous.querySelector('.num-can'), { yPercent: -45, rotation: i % 2 ? 14 : -14, opacity: 0, duration: 0.4, ease: 'power2.in' }, at - 0.1);
    }
    // The first figure is already on screen when the pin starts; it only counts.
    if (i) counter
      .fromTo(rolls(step), { yPercent: 135 }, { yPercent: 0, duration: 0.4, ease: 'power3.out', stagger: 0.06 }, at + 0.2)
      .fromTo(can, { yPercent: 45, rotation: i % 2 ? -18 : 18, opacity: 0 }, { yPercent: 0, rotation: i % 2 ? -8 : 8, opacity: 1, duration: 0.45, ease: 'power3.out' }, at + 0.2);
    else gsap.set(can, { rotation: 8 });
    counter.to(counters[i].state, { value: counters[i].target, duration: 0.5, ease: 'power2.out', onUpdate: counters[i].render }, i ? at + 0.25 : 0.05);
  });

  // 5. Finale:  // 5. Finale: title lines and cans rise in, then cans drift at different speeds.
  gsap.from('.finale h2 .line > span', { yPercent: 110, duration: 1, stagger: 0.1, ease: 'power4.out', scrollTrigger: { trigger: '.finale', start: 'top 60%' } });
  gsap.from('.lineup-item', { y: 160, rotation: (i: number) => (i % 2 ? 14 : -14), opacity: 0, duration: 1, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: '.lineup', start: 'top 85%' } });
  gsap.utils.toArray<HTMLElement>('.lineup-item img').forEach((img, i) => {
    gsap.to(img, { yPercent: i % 2 ? -7 : 5, ease: 'none', scrollTrigger: { trigger: '.lineup', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.from('.footer-signature', { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.site-footer', start: 'top 85%' } });

  // The can idles with a slow float so the hero is never frozen.
  gsap.to('.hero-product img', { yPercent: -2.5, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  const pointerEvents = new AbortController();
  if (desktop) {
    const hero = document.querySelector<HTMLElement>('.hero')!;
    const image = hero.querySelector<HTMLImageElement>('.hero-product img')!;
    const x = gsap.quickTo(image, 'x', { duration: 0.7, ease: 'power3.out' });
    const y = gsap.quickTo(image, 'y', { duration: 0.7, ease: 'power3.out' });
    hero.addEventListener('pointermove', event => {
      const bounds = hero.getBoundingClientRect();
      x((event.clientX / bounds.width - 0.5) * 26);
      y(((event.clientY - bounds.top) / bounds.height - 0.5) * 18);
    }, { signal: pointerEvents.signal });
    hero.addEventListener('pointerleave', () => { x(0); y(0); }, { signal: pointerEvents.signal });
  }

  return () => {
    pointerEvents.abort();
    endJump();
    slider.setDriver(null);
    numbers.classList.remove('is-pinned');
    pin = undefined;
    smoother?.kill();
    smoother = undefined;
    gsap.set('.hero-product img', { clearProps: 'transform' });
  };
});

document.fonts.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
  if (location.hash) navigateTo(location.hash.slice(1));
}, { once: true, signal: events.signal });

if (import.meta.hot) import.meta.hot.dispose(() => {
  events.abort();
  assetListeners.abort();
  assetsObserver.disconnect();
  slider.destroy();
  media.revert();
});
