import { INVITE } from './content';
import { bloomAt, crossStitch, leafAt, sprig, wreathSVG, type Seg } from './wreath';

/** The letter: one continuous sheet of paper, divided into screen-sized pages. */

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

// Date: a moon cradled by a sprig, stars in cross-stitch. viewBox 200×120.
const CRADLE: Seg[] = [[[54, 86], [74, 104], [118, 106], [140, 90]], [[140, 90], [151, 81], [156, 68], [153, 54]]];
const skySVG = () => `<svg class="sky emb" viewBox="0 0 200 120" aria-hidden="true" style="--t0:1.2s">
  <defs>
    <clipPath id="moonClip"><path d="M8 -26 A28 28 0 1 0 8 26 A22 22 0 1 1 8 -26Z" /></clipPath>
    <linearGradient id="shootG" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="-46" y2="-15"><stop offset="0" class="g-hi" /><stop offset="1" class="g-mid" stop-opacity="0" /></linearGradient>
  </defs>
  <g transform="translate(100 52)"><g class="moon">
    <path class="moon-fill" d="M8 -26 A28 28 0 1 0 8 26 A22 22 0 1 1 8 -26Z" />
    <g clip-path="url(#moonClip)">${Array.from({ length: 15 }, (_, i) => `<path class="moon-stitch" d="M-34 ${-32 + i * 4.6} L10 ${-44 + i * 4.6}" />`).join('')}</g>
  </g></g>
  ${sprig(CRADLE, { leaves: 13, flowers: [0.48], size: 14, flowerSide: 1 })}
  ${crossStitch(30, 30, 3.2, 's1')}${crossStitch(52, 13, 2.4, 's2')}${crossStitch(168, 22, 2.8, 's3')}${crossStitch(184, 56, 2.2, 's4')}${crossStitch(22, 66, 2, 's5')}
  <g class="shooter"><path d="M0 0 L-46 -15" stroke="url(#shootG)" /><circle r="1.7" /></g>
</svg>`;

// Venue: a running-stitch path that ends in a flower. viewBox 100×120.
const ROUTE = 'M18 6 C76 14 84 40 48 54 C14 68 24 90 50 99';
const routeSVG = () => `<svg class="route emb" viewBox="0 0 100 120" aria-hidden="true" style="--t0:2.05s; --tf:.35s">
  <defs><mask id="routeMask"><path class="reveal" d="${ROUTE}" pathLength="1" /></mask></defs>
  <path class="trail" d="${ROUTE}" mask="url(#routeMask)" />
  ${leafAt([50, 102], -158, 21, 4, 0)}${leafAt([50, 102], -22, 21, 4, 1)}${bloomAt([50, 102], -90, 11.5, 0, 0)}
</svg>`;

// Sign-off: the two of you inside an embroidery hoop, a sprig over its lower edge. viewBox 200×200.
const HOOP_SPRIG: Seg[] = [[[22, 132], [30, 162], [58, 186], [94, 192]]];
const hoopRing = () => `<svg class="hoop-ring emb" viewBox="0 0 200 200" aria-hidden="true">
  <circle class="ring" cx="100" cy="100" r="93" pathLength="1" transform="rotate(-90 100 100)" />
  <circle class="ring ring2" cx="100" cy="100" r="88" pathLength="1" transform="rotate(-90 100 100)" />
  <g class="clasp"><rect x="92" y="1" width="16" height="10" rx="2.5" /><path d="M95.5 6 H104.5" /></g>
</svg>`;
const hoopSprig = () => `<svg class="hoop-sprig emb" viewBox="0 0 200 200" aria-hidden="true" style="--t0:1.1s">${sprig(HOOP_SPRIG, { leaves: 9, flowers: [0.55], size: 15, flowerSide: 1 })}</svg>`;

const edges = `<i class="edge l e1"></i><i class="edge l e2"></i><i class="edge r e1"></i><i class="edge r e2"></i>`;
const knots = `<i class="knot l"></i><i class="knot r"></i>`;

export function letterHTML(guest: string | null): string {
  const { names: n, date: d, venue: v } = INVITE;
  const amp = `<span class="amp foil">&amp;</span>`;
  return `
<article class="letter" id="letter" aria-label="Invitation">
  <div class="paper" aria-hidden="true"></div>

  <section class="page p1" id="p1">
    <i class="rule-top l e1"></i><i class="rule-top r e1"></i><i class="rule-top l e2"></i><i class="rule-top r e2"></i>
    ${edges}
    <div class="flow">
      <p class="greet ink soft">${guest ? esc(INVITE.greeting(guest)) : '&nbsp;'}</p>
      <div class="names-wrap">
        ${wreathSVG()}
        <h1 class="names"><span class="nm foil">${esc(n.first)}</span>${amp}<span class="nm foil">${esc(n.second)}</span></h1>
      </div>
      <div class="invite-block">
        <p class="invite ink soft">${INVITE.invite.map(esc).join('<br />')}</p>
        <p class="title ink">${esc(INVITE.title)}</p>
      </div>
    </div>
    <p class="cue" aria-hidden="true">Scroll</p>
  </section>

  <section class="page p2" id="p2">
    ${edges}${knots}
    <div class="wash" aria-hidden="true"><i class="w1"></i><i class="w2"></i></div>
    <div class="flow">
      <p class="label ink soft">${esc(d.label)}</p>
      <div class="dateblock">
        <span class="side ink soft">${esc(d.weekday)}</span>
        <span class="day ink">${esc(d.day)}</span>
        <span class="side ink soft">${esc(d.month)}<br />${esc(d.year)}</span>
      </div>
      ${skySVG()}
      <p class="time ink">${esc(d.time)}</p>
      <p class="count ink soft" id="count"></p>
      <div class="pills">
        <a class="pill" id="calBtn" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></svg>Add to calendar</a>
      </div>
    </div>
  </section>

  <section class="page p3" id="p3">
    ${edges}${knots}
    <div class="flow">
      <p class="label ink soft">${esc(v.label)}</p>
      ${routeSVG()}
      <p class="venue foil">${esc(v.name)}</p>
      <p class="addr ink soft">${v.lines.map(esc).join('<br />')}</p>
      <div class="pills">
        <a class="pill solid" id="dirBtn" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l18-8-8 18-2-8-8-2z" /></svg>Directions</a>
        <a class="pill" href="${v.mapsLink}" target="_blank" rel="noopener">Open in Maps</a>
      </div>
    </div>
  </section>

  <section class="page p4" id="p4">
    ${edges}${knots}
    <i class="rule-bot l e1"></i><i class="rule-bot r e1"></i><i class="rule-bot l e2"></i><i class="rule-bot r e2"></i>
    <svg class="bow" viewBox="-16 -13 32 26" aria-hidden="true"><path pathLength="1" d="M0 9 C-7 3 -13 -1 -13 -6 C-13 -11 -6 -13 0 -6 C6 -13 13 -11 13 -6 C13 -1 7 3 0 9" /></svg>
    <div class="flow">
      <div class="hoop">${hoopRing()}<div class="couple"><img src="${INVITE.couple.src}" width="${INVITE.couple.width}" height="${INVITE.couple.height}" alt="${esc(n.first)} and ${esc(n.second)}" decoding="async" /></div>${hoopSprig()}</div>
      <p class="with ink soft">${esc(INVITE.signoff)}</p>
      <p class="sign"><span class="foil">${esc(n.first)}</span>${amp}<span class="foil">${esc(n.second)}</span></p>
      <button class="putback" id="putBack" type="button">Put it back in the envelope</button>
    </div>
  </section>
</article>`;
}
