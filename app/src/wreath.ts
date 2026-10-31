/**
 * Embroidery motifs: slender sprigs of satin-stitch leaves in gold with small cupped flowers
 * in the wine of the seal. Leaves and flowers are placed along a stem curve so they always
 * follow the line. Used for the wreath around the names and the accents on later pages.
 */
export type P = [number, number];
export type Seg = [P, P, P, P];

const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const f = (n: number) => n.toFixed(1);

function at(stem: Seg[], t: number): { p: P; dir: number } {
  const n = stem.length, i = Math.min(n - 1, Math.floor(t * n)), u = t * n - i;
  const [a, b, c, d] = stem[i];
  const ab = lerp(a, b, u), bc = lerp(b, c, u), cd = lerp(c, d, u), abc = lerp(ab, bc, u), bcd = lerp(bc, cd, u);
  return { p: lerp(abc, bcd, u), dir: (Math.atan2(bcd[1] - abc[1], bcd[0] - abc[0]) * 180) / Math.PI };
}

/** A slim pointed leaf along +x from its base, with a split-stitch line down the middle. */
export const leaf = (len: number, w: number) =>
  `<path class="lf-body" d="M0 0 C${f(len * 0.28)} ${f(-w)} ${f(len * 0.7)} ${f(-w * 0.85)} ${f(len)} 0 C${f(len * 0.7)} ${f(w * 0.85)} ${f(len * 0.28)} ${f(w)} 0 0Z" />` +
  `<path class="lf-stitch" d="M${f(len * 0.14)} 0 L${f(len * 0.84)} 0" />`;

/** A small cupped flower opening along +x: back lobes, a lighter front petal, a gold calyx. */
export const flower = (r: number) =>
  `<path class="fl-back" d="M0 0 C${f(r * 0.3)} ${f(-r * 0.8)} ${f(r * 0.95)} ${f(-r * 0.95)} ${f(r * 1.3)} ${f(-r * 0.55)} C${f(r * 1.05)} ${f(-r * 0.28)} ${f(r * 1.12)} 0 ${f(r * 1.4)} 0 C${f(r * 1.12)} 0 ${f(r * 1.05)} ${f(r * 0.28)} ${f(r * 1.3)} ${f(r * 0.55)} C${f(r * 0.95)} ${f(r * 0.95)} ${f(r * 0.3)} ${f(r * 0.8)} 0 0Z" />` +
  `<path class="fl-front" d="M${f(r * 0.15)} 0 C${f(r * 0.4)} ${f(-r * 0.55)} ${f(r * 0.95)} ${f(-r * 0.45)} ${f(r * 1.12)} 0 C${f(r * 0.95)} ${f(r * 0.45)} ${f(r * 0.4)} ${f(r * 0.55)} ${f(r * 0.15)} 0Z" />` +
  `<path class="fl-calyx" d="M${f(-r * 0.15)} 0 L${f(r * 0.35)} ${f(-r * 0.32)} M${f(-r * 0.15)} 0 L${f(r * 0.35)} ${f(r * 0.32)}" />`;

/** A flower on a short stalk, rotated to `ang` at point p; stalk and flower grow out together. */
export const bloomAt = (p: P, ang: number, r: number, d: number, stalk = 5) =>
  `<g transform="translate(${f(p[0])} ${f(p[1])}) rotate(${f(ang)})"><g class="fl" style="--d:${d}">${stalk ? `<path class="stalk" d="M0 0 L${stalk} 0" />` : ''}<g transform="translate(${stalk} 0)">${flower(r)}</g></g></g>`;

/** A leaf rotated to `ang` at point p. */
export const leafAt = (p: P, ang: number, len: number, w: number, d: number) =>
  `<g transform="translate(${f(p[0])} ${f(p[1])}) rotate(${f(ang)})"><g class="lf" style="--d:${d}">${leaf(len, w)}</g></g>`;

interface SprigOptions {
  /** How many leaf positions along the stem (some are skipped around flowers). */
  leaves: number;
  /** Where flowers sit, 0 = base, 1 = tip. */
  flowers: number[];
  /** Leaf length at the base; leaves shrink toward the tip. */
  size?: number;
  /** Which side of the stem the flowers lean to (-1 left of travel, 1 right). */
  flowerSide?: -1 | 1;
  /** A closed bud at the tip. */
  bud?: boolean;
}

export function sprig(stem: Seg[], o: SprigOptions): string {
  const size = o.size ?? 19, side0 = o.flowerSide ?? -1;
  const out: string[] = [`<path class="stem" pathLength="1" d="M${stem[0][0].join(' ')} ${stem.map(([, b, c, d]) => `C${b.join(' ')} ${c.join(' ')} ${d.join(' ')}`).join(' ')}" />`];
  let k = 0;
  // Leaves alternate sides along the stem (like stitched lazy-daisy leaves), angled toward the
  // tip and getting smaller as the sprig thins; gaps are left where the flowers sit.
  for (let i = 0; i < o.leaves; i++) {
    const t = 0.04 + (i * 0.92) / Math.max(1, o.leaves - 1);
    if (o.flowers.some((ft) => Math.abs(t - ft) < 0.035)) continue;
    const { p, dir } = at(stem, t);
    const side = i % 2 ? 1 : -1;
    out.push(leafAt(p, dir + side * (34 - t * 6), size * (1 - t * 0.37), size * 0.163 * (1 - t * 0.26), k++));
  }
  o.flowers.forEach((t, i) => {
    const { p, dir } = at(stem, t);
    out.push(bloomAt(p, dir + side0 * 62, size * 0.38 * (1 - i * 0.08), i));
  });
  if (o.bud ?? true) {
    const tip = at(stem, 1);
    out.push(`<g transform="translate(${f(tip.p[0])} ${f(tip.p[1])}) rotate(${f(tip.dir)})"><g class="fl bud" style="--d:${o.flowers.length}"><path class="fl-back" d="M0 0 C2 -3.4 6 -3.2 8 0 C6 3.2 2 3.4 0 0Z" /></g></g>`);
  }
  return out.join('');
}

// The wreath sprig: from near the bottom centre, sweeping out and up the left side. viewBox 300×220.
const WREATH: Seg[] = [
  [[124, 204], [92, 198], [62, 178], [52, 146]],
  [[52, 146], [42, 114], [50, 78], [74, 50]],
  [[74, 50], [84, 38], [96, 30], [108, 26]],
];

/** Two sprigs with rotational balance, like the hoop: one rising on the left, one hanging on the right. */
export function wreathSVG(): string {
  const s = sprig(WREATH, { leaves: 20, flowers: [0.33, 0.61, 0.86] });
  return `<svg class="wreath emb" viewBox="0 0 300 220" aria-hidden="true"><g class="sp sp-l">${s}</g><g class="sp sp-r" transform="rotate(180 150 115)">${s}</g></svg>`;
}

/** A cross-stitch star: two short crossed stitches. */
export const crossStitch = (x: number, y: number, r: number, cls: string) =>
  `<path class="xst ${cls}" d="M${f(x - r)} ${f(y - r)} L${f(x + r)} ${f(y + r)} M${f(x + r)} ${f(y - r)} L${f(x - r)} ${f(y + r)}" />`;
