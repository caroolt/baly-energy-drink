import gsap from 'gsap';
import { flavors } from './flavors';
import { splashMarkup } from './art';

export function createFlavorSlider(root: HTMLElement) {
  const scenes = Array.from(root.querySelectorAll<HTMLElement>('.flavor-scene'));
  const choices = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-flavor]'));
  const previous = root.querySelector<HTMLButtonElement>('.previous')!;
  const next = root.querySelector<HTMLButtonElement>('.next')!;
  const status = root.querySelector<HTMLElement>('#flavor-status')!;
  const splashLayer = root.querySelector<HTMLElement>('.splash-layer')!;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const { signal } = controller;
  splashLayer.innerHTML = splashMarkup();
  const splash = splashLayer.querySelector<SVGSVGElement>('svg')!;
  const splashBody = splash.querySelector('path')!;
  const splashDrops = splash.querySelector('g')!;
  let current = 0;
  let destination = 0;
  let queued: number | null = null;
  let busy = false;
  let alive = true;
  let timeline: gsap.core.Timeline | null = null;
  let touch: { x: number; y: number; id: number } | null = null;

  function updateInterface(index: number) {
    const flavor = flavors[index];
    root.dataset.current = flavor.id;
    root.style.setProperty('--scene-ink', flavor.ink);
    root.style.setProperty('--scene-accent', flavor.accent);
    root.querySelector('.current-number')!.textContent = String(index + 1).padStart(2, '0');
    root.querySelector('.current-flavor')!.textContent = flavor.name;
    choices.forEach((button, i) => button.setAttribute('aria-current', String(i === index)));
    status.textContent = `Sabor ${index + 1} de ${flavors.length}: ${flavor.name}.`;
  }

  function settle(index: number) {
    const flavor = flavors[index];
    scenes.forEach((scene, i) => {
      scene.hidden = i !== index;
      scene.inert = i !== index;
      gsap.set(scene, { clearProps: 'opacity,visibility' });
      gsap.set(scene.querySelectorAll('.scene-product, .scene-copy, .flavor-word, .scene-art, .scene-photos'), { clearProps: 'opacity,visibility,transform' });
    });
    root.style.setProperty('--scene-bg', flavor.color);
    gsap.set(splash, { scale: 0 });
    current = index;
    destination = index;
    busy = false;
    root.dataset.transitioning = 'false';
    updateInterface(index);
    if (queued !== null) {
      const request = queued;
      queued = null;
      if (request !== current) void select(request);
    }
  }

  async function warmImage(index: number) {
    scenes[index].querySelectorAll<HTMLImageElement>('img[data-src]').forEach(image => {
      image.src = image.dataset.src!;
      delete image.dataset.src;
    });
    const img = scenes[index].querySelector<HTMLImageElement>('.scene-product img');
    if (!img) return;
    img.loading = 'eager';
    // decode failure never deadlocks the controls; missing originals are tracked separately.
    let timer: ReturnType<typeof setTimeout> | undefined;
    await Promise.race([
      img.decode().catch(() => undefined),
      new Promise<void>(resolve => { timer = setTimeout(resolve, 1500); }),
    ]);
    clearTimeout(timer);
  }

  async function select(request: number) {
    const index = ((request % flavors.length) + flavors.length) % flavors.length;
    if (!alive) return;
    if (busy) { queued = index; return; }
    if (index === current) return;
    busy = true;
    destination = index;
    root.dataset.transitioning = 'true';
    await warmImage(index);
    if (!alive) return;
    if (reducedMotion.matches) { settle(index); return; }

    const incoming = scenes[index];
    const outgoing = scenes[current];
    const flavor = flavors[index];
    const product = incoming.querySelector('.scene-product')!;
    const copy = incoming.querySelector('.scene-copy')!;
    const word = incoming.querySelector('.flavor-word')!;
    const art = incoming.querySelector('.scene-art')!;
    const photos = incoming.querySelector('.scene-photos')!;
    incoming.hidden = false;
    incoming.inert = false;
    outgoing.inert = true;
    gsap.set(incoming, { autoAlpha: 1 });
    gsap.set([product, copy, word, art, photos], { opacity: 0 });
    gsap.set(splash, { fill: flavor.color, scale: 0.035, rotation: -18 });
    gsap.set(splashBody, { scale: 1, transformOrigin: '50% 50%' });
    gsap.set(splashDrops, { scale: 0.7, opacity: 1, transformOrigin: '50% 50%' });
    const size = Math.min(innerWidth <= 700 ? root.clientWidth * 0.9 : root.clientWidth * 0.65, innerWidth <= 700 ? Infinity : 650);
    const cover = Math.hypot(root.clientWidth, root.clientHeight) * 2.7 / size;

    timeline = gsap.timeline({ onComplete: () => settle(index) });
    timeline
      .to(outgoing.querySelector('.scene-product'), { x: -55, y: 20, scale: 0.9, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0)
      .to(outgoing.querySelectorAll('.scene-copy, .flavor-word, .scene-art, .scene-photos'), { opacity: 0, duration: 0.2 }, 0.02)
      .to(splash, { scale: cover, rotation: 10, duration: 0.82, ease: 'power2.inOut' }, 0.04)
      .to(splashDrops, { scale: 1.35, duration: 0.55, ease: 'power2.out' }, 0.09)
      .call(() => updateInterface(index), [], 0.35)
      .fromTo(art, { scale: 1.15, rotation: -4, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.65, ease: 'power2.out' }, 0.38)
      .fromTo(word, { y: 55, opacity: 0 }, { y: 0, opacity: innerWidth <= 700 ? 0.2 : 0.15, duration: 0.6, ease: 'power3.out' }, 0.42)
      .fromTo(product, { x: 85, y: 35, rotation: flavor.tilt + 12, scale: 0.9, opacity: 0 }, { x: 0, y: 0, rotation: flavor.tilt, scale: 1, opacity: 1, duration: 0.76, ease: 'power3.out' }, 0.32)
      .fromTo(photos, { y: 65, rotation: -7, scale: 0.9, opacity: 0 }, { y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.78, ease: 'power3.out' }, 0.42)
      .fromTo(copy, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }, 0.58);
  }

  const move = (step: number) => { void select((queued ?? destination) + step); };
  previous.addEventListener('click', () => move(-1), { signal });
  next.addEventListener('click', () => move(1), { signal });
  choices.forEach((choice, index) => choice.addEventListener('click', () => { void select(index); }, { signal }));
  root.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'Home') { event.preventDefault(); void select(0); }
    if (event.key === 'End') { event.preventDefault(); void select(flavors.length - 1); }
  }, { signal });

  root.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || (event.target as HTMLElement).closest('button,a')) return;
    touch = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }, { signal });
  root.addEventListener('pointerup', event => {
    if (!touch || event.pointerId !== touch.id) return;
    const dx = event.clientX - touch.x;
    const dy = event.clientY - touch.y;
    touch = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1);
  }, { signal });
  root.addEventListener('pointercancel', () => { touch = null; }, { signal });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && timeline?.isActive()) { timeline.kill(); settle(destination); }
  }, { signal });
  root.dataset.transitioning = 'false';
  updateInterface(0);

  return {
    select,
    destroy() { alive = false; controller.abort(); timeline?.kill(); },
  };
}
