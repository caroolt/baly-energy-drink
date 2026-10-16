// The timeline is one yellow ribbon that dances down the page. Each milestone sits on one side;
// the ribbon swings to the empty side of that row and ties a loop there (a prolate cycloid:
// a point spinning on a circle that is itself moving down), then glides across to the next row.
// It is rebuilt from the real layout and draws itself as you scroll.
export function createStoryPath(flow: HTMLElement) {
  const svg = flow.querySelector<SVGSVGElement>('.story-path')!;
  const line = svg.querySelector<SVGPathElement>('.story-path-line')!;
  const cards = Array.from(flow.querySelectorAll<HTMLElement>('.milestone'));
  let length = 0;
  let progress = 1;
  let thickness = 26;

  const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

  function layout() {
    const box = flow.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const narrow = box.width < 700;
    thickness = narrow ? 18 : Math.min(96, Math.max(56, box.width * 0.05));
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    const radius = narrow ? 18 : Math.min(230, thickness * 2.7);
    const gap = parseFloat(getComputedStyle(flow.querySelector('.story-list')!).rowGap) || 0;
    const rows = cards.map((card, i) => {
      const rect = card.getBoundingClientRect();
      const leftCard = getComputedStyle(card).alignSelf !== 'flex-end';
      const x = narrow ? 20 : box.width * (leftCard ? (i % 4 < 2 ? 0.7 : 0.78) : (i % 4 < 2 ? 0.3 : 0.22));
      // A loop spans 3.5 radii vertically (from 2r above its centre line to 1.5r below). Fit it in the
      // row plus most of the gaps around it, so it never reaches the cards above or below on that side.
      const r = Math.max(narrow ? 10 : 40, Math.min(radius, (rect.height + gap * 1.4 - thickness * 1.3) / 3.5));
      const centre = rect.top - box.top + rect.height / 2;
      return { x, r, top: rect.top - box.top, bottom: rect.bottom - box.top, loopC: centre + r * 0.25, spin: i % 2 ? -1 : 1 };
    });
    // Base lane: stays on the empty side beside each card and only crosses over in the gaps between cards.
    const lanes = [{ x: narrow ? 20 : box.width * 0.5, top: 0, bottom: 0 }, ...rows, { x: narrow ? 20 : box.width * 0.5, top: box.height, bottom: box.height }];
    const laneX = (y: number) => {
      for (let i = 0; i < lanes.length - 1; i++) {
        const a = lanes[i];
        const b = lanes[i + 1];
        // The crossing reaches a little into both rows, where the eased curve barely moves sideways,
        // so the turn stays wide and round without cutting into the text.
        const from = a.bottom - (a.bottom - a.top) * 0.12;
        const to = b.top + (b.bottom - b.top) * 0.12;
        if (y <= from) return a.x;
        if (y < to) return a.x + (b.x - a.x) * smoother((y - from) / Math.max(1, to - from));
      }
      return lanes[lanes.length - 1].x;
    };

    const points: string[] = [];
    for (let y = 0; y <= box.height; y += 3) {
      let x = laneX(y);
      let dy = 0;
      for (const row of rows) {
        const span = row.r * 3;
        const t = (y - (row.loopC - span / 2)) / span;
        if (t <= 0 || t >= 1) continue;
        // Eased spin: the loop starts and ends with zero speed, so it blends in without corners.
        const angle = smoother(t) * Math.PI * 2;
        x += row.spin * row.r * Math.sin(angle);
        dy -= row.r * (1 - Math.cos(angle));
      }
      points.push(`${x.toFixed(1)},${(y + dy).toFixed(1)}`);
    }
    line.setAttribute('d', `M${points.join(' L')}`);
    length = line.getTotalLength();
    line.style.strokeDasharray = `${length}`;
    draw(progress);
  }

  function draw(value: number) {
    progress = value;
    if (!length) return;
    line.style.strokeDashoffset = String(length * (1 - value));
    // The ribbon thickens as the story advances, building up to the flood that opens the finale.
    line.style.strokeWidth = String(thickness * (1 + 0.2 * value * value));
  }

  layout();
  return { layout, draw };
}
