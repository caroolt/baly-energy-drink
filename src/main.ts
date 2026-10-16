import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { flavors, productPath } from './flavors';
import { artMarkup, photoMarkup, spark } from './art';
import { createFlavorSlider } from './slider';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Inline icons avoid missing Unicode glyphs on minimal cloud/mobile font stacks.
document.querySelectorAll<HTMLElement>('.header-link span, .round-link > span:last-child, .manifesto-arrow, .hero-baseline span span, .text-link span, .back-top span, .arrow-button span').forEach(icon => {
  const direction = icon.textContent?.trim();
  const rotation = direction === '↗' ? -45 : direction === '↘' ? 45 : direction === '↓' ? 90 : direction === '↑' ? -90 : direction === '←' ? 180 : 0;
  icon.innerHTML = `<svg viewBox="0 0 32 32" width="1em" height="1em" fill="none" aria-hidden="true" style="transform:rotate(${rotation}deg)"><path d="M5 16H27M17 6L27 16L17 26" stroke="currentColor" stroke-width="1.6"/></svg>`;
});

const scenes = document.querySelector<HTMLElement>('#flavor-scenes')!;
scenes.innerHTML = flavors.map((flavor, index) => `
  <article class="flavor-scene" data-scene="${flavor.id}" role="group" aria-roledescription="slide" aria-label="${index + 1} de 7: ${flavor.name}" ${index ? 'hidden inert' : ''} style="--ink:${flavor.ink};--accent:${flavor.accent};--tilt:${flavor.tilt}deg">
    <div class="flavor-word ${flavor.display.length > 10 ? 'long-word' : ''}" aria-hidden="true">${flavor.display}</div>
    <div class="scene-art" aria-hidden="true">${artMarkup(flavor)}</div>
    <div class="scene-copy"><span class="scene-mood">${flavor.mood}</span><h2>${flavor.headline}</h2><p>${flavor.copy}</p></div>
    <div class="scene-product product-slot" data-product="${flavor.id}"><img ${index ? 'data-src' : 'src'}="${productPath(flavor.id)}" alt="Lata BALY ${flavor.name}" width="1086" height="1448" loading="lazy" decoding="async" /></div>
    <div class="scene-photos" aria-hidden="true">${photoMarkup(flavor)}</div>
    <span class="scene-vertical" aria-hidden="true">BALY / ${flavor.name.toLocaleUpperCase('pt-BR')} / ENERGY DRINK</span>
  </article>
`).join('');

document.querySelectorAll('.small-star, .ticker b, .solar-star, .pressure-mark').forEach(icon => { icon.innerHTML = spark; });

document.querySelector('#flavor-index')!.innerHTML = flavors.map((flavor, index) => `<button type="button" data-flavor="${flavor.id}" aria-label="Explorar ${flavor.name}" aria-current="${index === 0}"><span>${String(index + 1).padStart(2, '0')}</span>${flavor.name}</button>`).join('');

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
// The photographic sheet is only requested as the flavor explorer approaches.
assetsObserver.observe(document.querySelector('.flavor-scene')!);

const slider = createFlavorSlider(document.querySelector('#sabores')!);
const media = gsap.matchMedia();
let smoother: ScrollSmoother | undefined;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

function navigateTo(id: string, focus = false) {
  const target = document.getElementById(id);
  if (!target) return;
  if (smoother) smoother.scrollTo(target, !reduced.matches, 'top top');
  else target.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'start' });
  if (focus) {
    const focusTarget = target.querySelector<HTMLButtonElement>('button[aria-current="true"]');
    focusTarget?.focus({ preventScroll: true });
  }
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
    void slider.select(Number(button.dataset.revisit));
    history.pushState(null, '', '#sabores');
    navigateTo('sabores', true);
  }, { signal: events.signal });
});
window.addEventListener('popstate', () => navigateTo(location.hash.slice(1) || 'inicio'), { signal: events.signal });

media.add({ desktop: '(min-width: 1001px) and (pointer: fine)', motion: '(prefers-reduced-motion: no-preference)' }, context => {
  const { desktop, motion } = context.conditions!;
  if (!motion) return;
  if (desktop) {
    smoother = ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 0.85, effects: false, smoothTouch: 0, normalizeScroll: false });
  }

  gsap.from('.hero-title > span', { yPercent: 30, opacity: 0, stagger: 0.1, duration: 0.85, ease: 'power3.out' });
  gsap.from('.hero-product', { y: 65, rotation: -6, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.1 });
  gsap.to('.hero-product', { y: desktop ? 130 : 50, rotation: desktop ? 4 : -4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 } });
  gsap.to('.hero-title', { y: desktop ? -80 : -25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.from('.manifesto h2', { y: 45, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top 90%', end: 'center 65%', scrub: true } });
  gsap.to('.ticker > div', { xPercent: -20, ease: 'none', scrollTrigger: { trigger: '.ticker', start: 'top bottom', end: 'bottom top', scrub: 0.4 } });
  gsap.from('.lineup-item', { y: 90, opacity: 0, stagger: 0.055, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.lineup', start: 'top 85%', toggleActions: 'play none none none' } });

  const pointerEvents = new AbortController();
  if (desktop) {
    const hero = document.querySelector<HTMLElement>('.hero')!;
    const image = hero.querySelector<HTMLImageElement>('.hero-product img')!;
    const x = gsap.quickTo(image, 'x', { duration: 0.65, ease: 'power3.out' });
    const y = gsap.quickTo(image, 'y', { duration: 0.65, ease: 'power3.out' });
    hero.addEventListener('pointermove', event => {
      const bounds = hero.getBoundingClientRect();
      x((event.clientX / bounds.width - 0.5) * 22);
      y(((event.clientY - bounds.top) / bounds.height - 0.5) * 16);
    }, { signal: pointerEvents.signal });
    hero.addEventListener('pointerleave', () => { x(0); y(0); }, { signal: pointerEvents.signal });

    const stage = document.querySelector<HTMLElement>('#sabores')!;
    stage.addEventListener('pointermove', event => {
      if (stage.dataset.transitioning === 'true') return;
      const bounds = stage.getBoundingClientRect();
      const dx = (event.clientX - bounds.left) / bounds.width - 0.5;
      const dy = (event.clientY - bounds.top) / bounds.height - 0.5;
      const active = stage.querySelector('.flavor-scene:not([hidden])')!;
      gsap.to(active.querySelector('.scene-product img'), { x: dx * 12, y: dy * 8, rotationY: dx * 5, rotationX: -dy * 4, transformPerspective: 900, duration: 0.65, overwrite: 'auto', ease: 'power2.out' });
      gsap.to(active.querySelector('.scene-photos'), { x: -dx * 23, y: -dy * 14, duration: 0.75, overwrite: 'auto', ease: 'power2.out' });
    }, { signal: pointerEvents.signal });
    stage.addEventListener('pointerleave', () => {
      gsap.to(stage.querySelectorAll('.scene-product img, .scene-photos'), { x: 0, y: 0, rotationY: 0, rotationX: 0, duration: 0.6, overwrite: 'auto' });
    }, { signal: pointerEvents.signal });
  }

  return () => {
    pointerEvents.abort();
    smoother?.kill();
    smoother = undefined;
    gsap.set('.hero-product img, .scene-product img, .scene-photos', { clearProps: 'transform' });
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
