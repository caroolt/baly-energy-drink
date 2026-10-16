import { test, expect, type Page } from '@playwright/test';

// The preloader locks scrolling until it lifts; interactions start after it is gone.
const ready = (page: Page) => expect(page.locator('#preloader')).toHaveCount(0, { timeout: 10000 });

const names = ['Tradicional', 'Tropical', 'Maçã Verde', 'Melancia', 'Morango e Pêssego', 'Coco e Açaí', 'Tadaly'];

test('all seven flavors, wrapping, and live announcements', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#sabores');
  const region = page.getByRole('region', { name: 'Explore os sete sabores BALY' });
  for (let index = 0; index < names.length; index++) {
    await region.getByRole('button', { name: `Explorar ${names[index]}`, exact: true }).click();
    await expect(region).toHaveAttribute('data-transitioning', 'false');
    await expect(page.getByRole('status')).toHaveText(`Sabor ${index + 1} de 7: ${names[index]}.`);
    await expect(page.locator('.flavor-scene:visible')).toHaveCount(1);
    await expect.poll(() => page.locator('.flavor-scene:visible .scene-product img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy();
    await expect(region.getByRole('button', { name: `Explorar ${names[index]}`, exact: true })).toHaveAttribute('aria-current', 'true');
  }
  // Scroll drives the stage, so the ends are real ends: no wrapping back through six pinned screens.
  await expect(page.getByRole('button', { name: 'Próximo sabor' })).toBeDisabled();
  await page.getByRole('button', { name: 'Sabor anterior' }).click();
  await expect(page.getByRole('status')).toHaveText('Sabor 6 de 7: Coco e Açaí.');
  expect(errors).toEqual([]);
});

test('rapid choices settle on the last requested flavor and keyboard stays usable', async ({ page }) => {
  await page.goto('/#sabores');
  await ready(page);
  await page.getByRole('button', { name: 'Explorar Tropical', exact: true }).click();
  await page.getByRole('button', { name: 'Explorar Melancia', exact: true }).click();
  await page.getByRole('button', { name: 'Explorar Coco e Açaí', exact: true }).click();
  await expect(page.locator('#sabores')).toHaveAttribute('data-current', 'coco-acai');
  await expect(page.locator('#sabores')).toHaveAttribute('data-transitioning', 'false');
  await expect(page.locator('.flavor-scene:visible')).toHaveCount(1);
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('status')).toHaveText('Sabor 7 de 7: Tadaly.');
  await page.keyboard.press('Home');
  await expect(page.getByRole('status')).toHaveText('Sabor 1 de 7: Tradicional.');
});

for (const width of [320, 375, 768, 1440]) {
  test(`layout, direct selection and revisit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    await page.getByRole('link', { name: 'ESCOLHA SEU SABOR', exact: true }).click();
    await expect(page.locator('#sabores button[aria-current="true"]')).toBeFocused();
    await page.getByRole('button', { name: 'Explorar Morango e Pêssego', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('Sabor 5 de 7: Morango e Pêssego.');
    await expect(page.locator('#sabores')).toHaveAttribute('data-transitioning', 'false');
    const overlap = await page.evaluate(() => {
      const copy = document.querySelector('.flavor-scene:not([hidden]) .scene-copy')!.getBoundingClientRect();
      const controls = document.querySelector('.flavor-ui')!.getBoundingClientRect();
      return copy.bottom > controls.top;
    });
    expect(overlap).toBeFalsy();
    await page.getByRole('button', { name: 'Revisitar Tadaly' }).click();
    await expect(page.getByRole('status')).toHaveText('Sabor 7 de 7: Tadaly.');
    await expect(page.locator('#sabores')).toHaveAttribute('data-transitioning', 'false');
  });
}

test('original assets and final lineup load without missing images', async ({ page }) => {
  const imageErrors: string[] = [];
  page.on('response', response => {
    if (response.request().resourceType() === 'image' && response.status() >= 400) imageErrors.push(response.url());
  });
  await page.goto('/');
  await expect.poll(() => page.locator('.hero-product img').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(1086);
  await page.locator('#lineup').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.lineup img').evaluateAll(images => images.filter(img => (img as HTMLImageElement).naturalWidth === 1086).length)).toBe(7);
  await expect(page.locator('.asset-missing')).toHaveCount(0);
  expect(imageErrors).toEqual([]);
});

test('scrolling the page changes the flavor on its own, with snapping and no horizontal input', async ({ page }) => {
  await page.goto('/#sabores');
  await ready(page);
  await expect(page.getByRole('status')).toHaveText('Sabor 1 de 7: Tradicional.');
  const start = await page.evaluate(() => scrollY);
  await page.mouse.move(700, 400);
  for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(120); }
  await expect(page.getByRole('status')).not.toHaveText('Sabor 1 de 7: Tradicional.');
  await expect(page.locator('#sabores')).toHaveAttribute('data-transitioning', 'false');
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(start);
  // The stage stays pinned while it changes.
  const top = await page.locator('#sabores').evaluate(el => el.getBoundingClientRect().top);
  expect(Math.abs(top)).toBeLessThanOrEqual(1);
  const before = Number(await page.locator('.current-number').textContent());
  await page.getByRole('button', { name: 'Sabor anterior' }).click();
  await expect(page.locator('.current-number')).toHaveText(String(before - 1).padStart(2, '0'));
});

test('preloader counts up, then lifts and unlocks scrolling', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#preloader')).toBeVisible();
  await ready(page);
  expect(await page.evaluate(() => document.documentElement.classList.contains('is-loading'))).toBeFalsy();
});

test('story ribbon draws itself down the page past every milestone', async ({ page }) => {
  await page.goto('/');
  await ready(page);
  await expect(page.locator('.milestone')).toHaveCount(13);
  await expect(page.locator('.milestone').first()).toContainText('1997');
  await expect(page.locator('.milestone').last()).toContainText('2025');
  const drawn = () => page.locator('.story-path-line').evaluate(el => {
    const path = el as SVGPathElement;
    return 1 - parseFloat(path.style.strokeDashoffset || '0') / path.getTotalLength();
  });
  expect(await drawn()).toBeLessThan(0.05);
  const flow = await page.locator('.story-flow').evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, height: el.offsetHeight }));
  await page.evaluate(({ top, height }) => window.scrollTo(0, top + height / 2), flow);
  await expect.poll(drawn).toBeGreaterThan(0.3);
});

test('reduced motion changes flavors without splash animation or scroll smoothing', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#sabores');
  await expect(page.locator('#preloader')).toHaveCount(0);
  await page.getByRole('button', { name: 'Explorar Melancia', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Sabor 4 de 7: Melancia.');
  await expect(page.locator('#sabores')).toHaveAttribute('data-transitioning', 'false');
  expect(await page.locator('#smooth-wrapper').evaluate(el => getComputedStyle(el).position)).not.toBe('fixed');
  const scale = await page.locator('.splash-svg').evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a);
  expect(scale).toBe(0);
});

test('touch swipe advances a flavor, vertical gestures do not', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/#sabores');
  const slider = page.locator('#sabores');
  await slider.dispatchEvent('pointerdown', { pointerType: 'touch', pointerId: 1, clientX: 280, clientY: 350 });
  await slider.dispatchEvent('pointerup', { pointerType: 'touch', pointerId: 1, clientX: 80, clientY: 355 });
  await expect(page.getByRole('status')).toHaveText('Sabor 2 de 7: Tropical.');
  await expect(slider).toHaveAttribute('data-transitioning', 'false');
  await slider.dispatchEvent('pointerdown', { pointerType: 'touch', pointerId: 2, clientX: 250, clientY: 300 });
  await slider.dispatchEvent('pointerup', { pointerType: 'touch', pointerId: 2, clientX: 230, clientY: 600 });
  await expect(page.getByRole('status')).toHaveText('Sabor 2 de 7: Tropical.');
});
