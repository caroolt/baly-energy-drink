import gsap from 'gsap';

type Options = { colors: string[]; ready: Promise<unknown> };

// The empty BALY wordmark fills from the bottom with a bubbling liquid that shifts through the
// flavor colours as the page loads. At 100% the liquid overflows: it rises across the whole screen
// with the same wave, then lifts away like a curtain. Resolves when the reveal begins.
export function runPreloader({ colors, ready }: Options): Promise<void> {
  const root = document.querySelector<HTMLElement>('#preloader');
  if (!root) return Promise.resolve();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { root.remove(); return Promise.resolve(); }

  const liquid = root.querySelector<HTMLElement>('.pl-liquid')!;
  const count = root.querySelector<HTMLElement>('.pl-count b')!;
  const bubbles = root.querySelector<HTMLElement>('.pl-bubbles')!;
  const flood = root.querySelector<HTMLElement>('.pl-flood')!;
  const mix = gsap.utils.interpolate(colors);
  gsap.set(liquid, { yPercent: 100 });
  document.documentElement.classList.add('is-loading');

  // Bubbles rise inside the letters only (they live in the masked layer).
  bubbles.innerHTML = Array.from({ length: 22 }, () => '<i></i>').join('');
  const rising = Array.from(bubbles.children).map(bubble => {
    const size = gsap.utils.random(4, 16);
    gsap.set(bubble, { width: size, height: size, left: `${gsap.utils.random(0, 100)}%` });
    return gsap.fromTo(bubble, { y: 0, opacity: 0 }, {
      y: () => -gsap.utils.random(60, 340), opacity: 0.9, x: () => gsap.utils.random(-14, 14),
      duration: gsap.utils.random(0.9, 1.8), delay: gsap.utils.random(0, 1.5), repeat: -1, repeatRefresh: true, ease: 'sine.in',
    });
  });
  const surf = gsap.to(root.querySelectorAll('.pl-wave'), { xPercent: -50, duration: 0.9, ease: 'none', repeat: -1 });

  return new Promise<void>(resolve => {
    const state = { level: 0 };
    const fill = gsap.timeline();
    fill
      .from(root.querySelectorAll('.pl-top span, .pl-bottom > *'), { opacity: 0, y: 10, stagger: 0.08, duration: 0.6, ease: 'power2.out' }, 0)
      .from('.pl-logo', { scale: 0.92, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0)
      .to(state, {
        level: 1,
        duration: 2.6,
        ease: 'power1.inOut',
        onUpdate: () => {
          count.textContent = String(Math.round(state.level * 100));
          root.style.setProperty('--liq', mix(state.level));
          gsap.set(liquid, { yPercent: 100 - state.level * 100 });
        },
      }, 0.2);

    // Never hold the page hostage: real assets get 4 s at most.
    const loaded = Promise.race([ready.catch(() => undefined), new Promise(r => setTimeout(r, 4000))]);
    Promise.all([fill.then(), loaded]).then(() => {
      const exit = gsap.timeline({ onComplete: () => {
        rising.forEach(tween => tween.kill());
        surf.kill();
        root.remove();
        document.documentElement.classList.remove('is-loading');
      } });
      exit
        .to(root.querySelectorAll('.pl-top, .pl-bottom'), { opacity: 0, duration: 0.3 }, 0)
        .fromTo(flood, { autoAlpha: 1, yPercent: 105 }, { yPercent: 0, duration: 0.9, ease: 'power3.inOut' }, 0.05)
        .to('.pl-logo', { yPercent: -18, opacity: 0, duration: 0.6, ease: 'power2.in' }, 0.25)
        .set(root, { backgroundColor: 'transparent' }, 0.95)
        .to(flood, { yPercent: -100, duration: 0.85, ease: 'expo.inOut' }, 1)
        .call(resolve, [], 1.2);
    });
  });
}
