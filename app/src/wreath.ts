/**
 * An embroidered wreath: two slender sprigs curving around opposite sides of the names
 * (the left one grows up from the bottom, the right one hangs down from the top), with
 * paired satin-stitch leaves in gold and small cupped flowers in the wine of the seal.
 * Everything is placed along the stem curve, so leaves always follow the line.
 */
type P = [number, number];
type Seg = [P, P, P, P];

// One sprig: from near the bottom centre, sweeping out and up the left side. viewBox 300×220.
const STEM: Seg[] = [
  [[124, 204], [92, 198], [62, 178], [52, 146]],
  [[52, 146], [42, 114], [50, 78], [74, 50]],
  [[74, 50], [84, 38], [96, 30], [108, 26]],
];

const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
function at(t: number): { p: P; dir: number } {
  const n = STEM.length, i = Math.min(n - 1, Math.floor(t * n)), u = t * n - i;
  const [a, b, c, d] = STEM[i];
  const ab = lerp(a, b, u), bc = lerp(b, c, u), cd = lerp(c, d, u), abc = lerp(ab, bc, u), bcd = lerp(bc, cd, u);
  const p = lerp(abc, bcd, u);
  return { p, dir: (Math.atan2(bcd[1] - abc[1], bcd[0] - abc[0]) * 180) / Math.PI };
}
const f = (n: number) => n.toFixed(1);

/** A slim pointed leaf along +x from its base, with a split-stitch line down the middle. */
const leaf = (len: number, w: number) =>
  `<path class="lf-body" d="M0 0 C${f(len * 0.28)} ${f(-w)} ${f(len * 0.7)} ${f(-w * 0.85)} ${f(len)} 0 C${f(len * 0.7)} ${f(w * 0.85)} ${f(len * 0.28)} ${f(w)} 0 0Z" />` +
  `<path class="lf-stitch" d="M${f(len * 0.14)} 0 L${f(len * 0.84)} 0" />`;

/** A small cupped flower opening along +x: back lobes, a lighter front petal, a gold calyx. */
const flower = (r: number) =>
  `<path class="fl-back" d="M0 0 C${f(r * 0.3)} ${f(-r * 0.8)} ${f(r * 0.95)} ${f(-r * 0.95)} ${f(r * 1.3)} ${f(-r * 0.55)} C${f(r * 1.05)} ${f(-r * 0.28)} ${f(r * 1.12)} 0 ${f(r * 1.4)} 0 C${f(r * 1.12)} 0 ${f(r * 1.05)} ${f(r * 0.28)} ${f(r * 1.3)} ${f(r * 0.55)} C${f(r * 0.95)} ${f(r * 0.95)} ${f(r * 0.3)} ${f(r * 0.8)} 0 0Z" />` +
  `<path class="fl-front" d="M${f(r * 0.15)} 0 C${f(r * 0.4)} ${f(-r * 0.55)} ${f(r * 0.95)} ${f(-r * 0.45)} ${f(r * 1.12)} 0 C${f(r * 0.95)} ${f(r * 0.45)} ${f(r * 0.4)} ${f(r * 0.55)} ${f(r * 0.15)} 0Z" />` +
  `<path class="fl-calyx" d="M${f(-r * 0.15)} 0 L${f(r * 0.35)} ${f(-r * 0.32)} M${f(-r * 0.15)} 0 L${f(r * 0.35)} ${f(r * 0.32)}" />`;

function sprig(): string {
  const out: string[] = [`<path class="stem" pathLength="1" d="M${STEM[0][0].join(' ')} ${STEM.map(([, b, c, d]) => `C${b.join(' ')} ${c.join(' ')} ${d.join(' ')}`).join(' ')}" />`];
  let k = 0;
  // Leaves alternate sides along the stem (like stitched lazy-daisy leaves), angled toward the tip
  // and getting smaller as the sprig thins; gaps are left where the flowers sit.
  for (let i = 0; i < 20; i++) {
    const t = 0.04 + i * 0.047;
    if ([0.33, 0.61, 0.86].some((ft) => Math.abs(t - ft) < 0.035)) continue;
    const { p, dir } = at(t);
    const side = i % 2 ? 1 : -1;
    const len = 19 - t * 7, w = 3.1 - t * 0.8;
    out.push(`<g transform="translate(${f(p[0])} ${f(p[1])}) rotate(${f(dir + side * (34 - t * 6))})"><g class="lf" style="--d:${k++}">${leaf(len, w)}</g></g>`);
  }
  // Three flowers on short stalks on the outer side, and a closed bud at the tip.
  [0.33, 0.61, 0.86].forEach((t, i) => {
    const { p, dir } = at(t);
    // The stalk belongs to the flower, so they grow out of the stem together.
    out.push(`<g transform="translate(${f(p[0])} ${f(p[1])}) rotate(${f(dir - 62)})"><g class="fl" style="--d:${i}"><path class="stalk" d="M0 0 L5 0" /><g transform="translate(5 0)">${flower(7.2 - i * 0.6)}</g></g></g>`);
  });
  const tip = at(1);
  out.push(`<g transform="translate(${f(tip.p[0])} ${f(tip.p[1])}) rotate(${f(tip.dir)})"><g class="fl bud" style="--d:3"><path class="fl-back" d="M0 0 C2 -3.4 6 -3.2 8 0 C6 3.2 2 3.4 0 0Z" /></g></g>`);
  return out.join('');
}

/** Two sprigs with rotational balance, like the hoop: one rising on the left, one hanging on the right. */
export function wreathSVG(): string {
  const s = sprig();
  return `<svg class="wreath" viewBox="0 0 300 220" aria-hidden="true"><g class="sp sp-l">${s}</g><g class="sp sp-r" transform="rotate(180 150 115)">${s}</g></svg>`;
}
