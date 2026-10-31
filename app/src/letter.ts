import { INVITE } from './content';

/** The letter: one continuous sheet of paper, divided into screen-sized pages. */

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

const bud = (d: number, x: number, y: number, r: number) =>
  `<g class="bud" style="--d:${d}"><path d="M0 0 C4 -6 12 -6 17 0 C12 6 4 6 0 0Z" transform="translate(${x} ${y}) rotate(${r})" /></g>`;
const bloom = (d: number, x: number, y: number, rx: number, ry: number) =>
  `<g class="bud" style="--d:${d}"><g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288]
    .map((a) => `<ellipse rx="${rx}" ry="${ry}" cy="-${ry}" transform="rotate(${a})" />`).join('')}</g></g>`;
const sprig = `<path class="stem" pathLength="1" d="M128 192 C78 186 34 154 26 100 C22 70 32 40 52 18" />
  ${bud(0, 84, 182, -170)}${bud(1, 50, 160, -130)}${bud(2, 30, 122, -100)}${bud(3, 28, 84, -60)}${bloom(4, 40, 140, 2.3, 5)}${bloom(5, 52, 18, 2, 4.4)}`;

const star = (cls: string, cx: number, cy: number, r: number) =>
  `<path class="star ${cls}" d="M${cx} ${cy - r} Q${cx} ${cy} ${cx + r} ${cy} Q${cx} ${cy} ${cx} ${cy + r} Q${cx} ${cy} ${cx - r} ${cy} Q${cx} ${cy} ${cx} ${cy - r}Z" />`;

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
        <svg class="sprigs" viewBox="0 0 300 200" aria-hidden="true"><g>${sprig}</g><g transform="translate(300 0) scale(-1 1)">${sprig}</g><path class="tie" pathLength="1" d="M128 192 C138 193 144 195 150 196 C156 195 162 193 172 192 M150 196 C143 189 134 189 137 194 C140 199 147 198 150 196 C153 198 160 199 163 194 C166 189 157 189 150 196 M150 196 C147 201 144 205 140 208 M150 196 C153 201 156 205 160 208" /></svg>
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
      <svg class="dusk" viewBox="0 0 160 64" aria-hidden="true">
        <defs>
          <linearGradient id="goldG" x1="0" x2="1" y1="0" y2="1"><stop offset="0" class="g-lo" /><stop offset=".5" class="g-hi" /><stop offset="1" class="g-lo" /></linearGradient>
          <radialGradient id="haloG"><stop offset="0" class="g-hi" stop-opacity=".5" /><stop offset="1" class="g-hi" stop-opacity="0" /></radialGradient>
          <linearGradient id="shootG" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="-46" y2="-15"><stop offset="0" class="g-hi" /><stop offset="1" class="g-mid" stop-opacity="0" /></linearGradient>
          <clipPath id="sky"><rect x="0" y="-60" width="160" height="110" /></clipPath>
        </defs>
        <path class="const" d="M26 16 L46 30 L70 10" />
        <g clip-path="url(#sky)">
          <g class="sun"><circle r="8" /><path d="M0 -12.5 V-16 M8.8 -8.8 L11.3 -11.3 M-8.8 -8.8 L-11.3 -11.3 M12.5 0 H16 M-12.5 0 H-16" /></g>
          <g class="moon"><circle class="halo" r="17" /><path class="crescent" d="M3 -10 A10.5 10.5 0 1 0 3 10 A8 8 0 1 1 3 -10 Z" /><path class="hatch" d="M-6 -6 L-2 -8 M-8 -2 L-2 -5 M-8.4 2 L-2.4 -1 M-7.4 6 L-2.6 3.4 M-4.6 9 L-1.6 7.4" /></g>
        </g>
        ${star('s1', 26, 16, 6)}${star('s2', 46, 30, 4.5)}${star('s3', 70, 10, 5)}${star('s4', 138, 11.5, 3.5)}${star('s5', 14, 33, 3)}
        <g class="shooter"><path d="M0 0 L-46 -15" stroke="url(#shootG)" /><circle r="1.7" /></g>
        <line class="hz" x1="8" y1="50" x2="152" y2="50" /><circle class="hzdot" cx="6" cy="50" r="1.2" /><circle class="hzdot" cx="154" cy="50" r="1.2" />
      </svg>
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
      <svg class="route" viewBox="0 0 80 110" aria-hidden="true">
        <defs><mask id="routeMask"><path class="reveal" d="M14 4 C60 14 66 34 38 46 C12 58 20 76 40 84" pathLength="1" /></mask></defs>
        <path class="trail" d="M14 4 C60 14 66 34 38 46 C12 58 20 76 40 84" mask="url(#routeMask)" />
        <path class="pin" d="M40 108 C40 108 30 98 30 91 A10 10 0 0 1 50 91 C50 98 40 108 40 108Z M40 87.5 A3.5 3.5 0 1 0 40 94.5 A3.5 3.5 0 1 0 40 87.5Z" fill-rule="evenodd" />
      </svg>
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
    <svg class="bow" viewBox="-30 -16 60 32" aria-hidden="true"><path pathLength="1" d="M0 0 C-14 -12 -27 -6 -23 4 C-19 12 -6 6 0 0 C6 6 19 12 23 4 C27 -6 14 -12 0 0" /><path pathLength="1" d="M0 0 C-3 5 -7 9 -12 12 M0 0 C3 5 7 9 12 12" /></svg>
    <div class="flow">
      <div class="couple"><img src="${INVITE.couple.src}" width="${INVITE.couple.width}" height="${INVITE.couple.height}" alt="${esc(n.first)} and ${esc(n.second)}" decoding="async" /></div>
      <p class="with ink soft">${esc(INVITE.signoff)}</p>
      <p class="sign"><span class="foil">${esc(n.first)}</span>${amp}<span class="foil">${esc(n.second)}</span></p>
      <button class="putback" id="putBack" type="button">Put it back in the envelope</button>
    </div>
  </section>
</article>`;
}
