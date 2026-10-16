import type { Flavor } from './flavors';

function photo(cell: number, position: string) {
  return `<span class="photo-item ${position}" data-cell="${cell}" style="--column:${cell % 4};--row:${Math.floor(cell / 4)}"><img data-src="/assets/art/flavor-ingredients.webp" alt="" width="1774" height="887" decoding="async"/></span>`;
}

export function photoMarkup(flavor: Flavor) {
  if (flavor.art === 'slice') return photo(0, 'photo-front') + photo(0, 'photo-back');
  if (flavor.art === 'seeds') return photo(1, 'photo-front') + photo(1, 'photo-back');
  if (flavor.art === 'duo') return photo(2, 'photo-front') + photo(3, 'photo-back');
  if (flavor.art === 'pearl') return photo(4, 'photo-front') + photo(5, 'photo-back');
  if (flavor.art === 'sun') return photo(6, 'photo-front photo-leaf') + photo(6, 'photo-back photo-leaf');
  if (flavor.art === 'pressure') return photo(7, 'photo-liquid');
  return '';
}

export const spark = '<svg viewBox="0 0 100 100" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M50 0C54 35 65 46 100 50C65 54 54 65 50 100C46 65 35 54 0 50C35 46 46 35 50 0Z"/></svg>';

// Original vector art: graphic liquid silhouettes, never substitute product artwork.
export const liquidPath = 'M250 67C267 61 268 23 284 30C301 38 278 83 307 88C336 94 352 41 368 53C387 67 335 109 359 128C383 148 420 102 434 124C448 146 389 161 399 184C411 214 468 185 477 209C487 237 421 228 423 253C425 282 476 299 462 321C448 344 406 303 389 325C371 348 414 389 395 404C375 420 347 368 324 382C299 397 315 455 290 459C265 463 275 402 248 404C221 406 206 467 184 453C163 439 197 396 173 380C149 364 112 412 94 390C78 370 130 338 111 316C91 294 44 326 33 302C22 278 83 271 79 246C74 217 18 219 27 193C36 168 91 190 102 164C112 139 69 112 89 94C109 75 138 126 162 112C185 99 162 51 185 43C210 35 218 81 239 75Z';

const drops = '<ellipse cx="57" cy="60" rx="11" ry="19" transform="rotate(-38 57 60)"/><ellipse cx="438" cy="57" rx="10" ry="21" transform="rotate(40 438 57)"/><ellipse cx="473" cy="387" rx="12" ry="20" transform="rotate(-30 473 387)"/><ellipse cx="85" cy="454" rx="9" ry="19" transform="rotate(40 85 454)"/>';

export function splashMarkup() {
  return `<svg viewBox="0 0 500 500" class="splash-svg" xmlns="http://www.w3.org/2000/svg"><g class="splash-drops">${drops}</g><path class="splash-body" d="${liquidPath}"/></svg>`;
}

export function artMarkup(flavor: Flavor) {
  const common = `<div class="scene-orbit orbit-one"></div><div class="scene-orbit orbit-two"></div>`;
  if (flavor.art === 'stars') return common + `<span class="art-star star-one">${spark}</span><span class="art-star star-two">${spark}</span><span class="art-star star-three">${spark}</span><div class="light-track"></div>`;
  if (flavor.art === 'seeds') return common + Array.from({ length: 7 }, (_, i) => `<i class="graphic-seed seed-${i}" style="--i:${i}"></i>`).join('') + '<div class="graphic-arc"></div>';
  if (flavor.art === 'sun') return common + '<div class="solar-disc"></div><span class="solar-star">✳</span><div class="liquid-ribbon"></div>';
  if (flavor.art === 'slice') return common + '<div class="graphic-slice slice-one"></div><div class="graphic-slice slice-two"></div><div class="graphic-slice slice-three"></div>';
  if (flavor.art === 'duo') return common + '<div class="duo-field"></div><div class="duo-ring"></div><span class="duo-ampersand">&</span>';
  if (flavor.art === 'pearl') return common + '<div class="pearl-field"></div><div class="pearl-ring"></div><div class="pearl-dot"></div>';
  return common + '<div class="pressure-ring"></div><div class="pressure-ring ring-two"></div><span class="pressure-mark">✳</span>';
}
