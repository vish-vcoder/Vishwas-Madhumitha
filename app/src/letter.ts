import { INVITE } from './content';
import { wreathSVG } from './wreath';

/** The letter: one continuous sheet of paper, divided into screen-sized pages. */

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

const star = (cls: string, cx: number, cy: number, r: number) =>
  `<path class="star ${cls}" d="M${cx} ${cy - r} Q${cx} ${cy} ${cx + r} ${cy} Q${cx} ${cy} ${cx} ${cy + r} Q${cx} ${cy} ${cx - r} ${cy} Q${cx} ${cy} ${cx} ${cy - r}Z" />`;

const edges = `<i class="edge l e1"></i><i class="edge l e2"></i><i class="edge r e1"></i><i class="edge r e2"></i>`;
const knots = `<i class="knot l"></i><i class="knot r"></i>`;

export function letterHTML(): string {
  const { names: n, date: d, venue: v } = INVITE;
  const amp = `<span class="amp foil">&amp;</span>`;
  return `
<article class="letter" id="letter" aria-label="Invitation">
  <div class="paper" aria-hidden="true"></div>

  <section class="page p1" id="p1">
    <i class="rule-top l e1"></i><i class="rule-top r e1"></i><i class="rule-top l e2"></i><i class="rule-top r e2"></i>
    ${edges}
    <div class="flow">
      <p class="greet ink soft" data-t="greeting">&nbsp;</p>
      <div class="names-wrap">
        ${wreathSVG()}
        <h1 class="names"><span class="nm foil" data-t="first"></span>${amp}<span class="nm foil" data-t="second"></span></h1>
      </div>
      <div class="invite-block">
        <p class="invite ink soft" data-t="before"></p>
        <p class="title ink" data-t="title"></p>
        <p class="invite after ink soft" data-t="after"></p>
      </div>
    </div>
    <p class="cue" aria-hidden="true" data-t="cue"></p>
  </section>

  <section class="page p2" id="p2">
    ${edges}${knots}
    <div class="wash" aria-hidden="true"><i class="w1"></i><i class="w2"></i></div>
    <div class="flow">
      <p class="label ink soft" data-t="dateLabel"></p>
      <div class="dateblock">
        <span class="side ink soft" data-t="weekday"></span>
        <span class="day ink">${esc(d.day)}</span>
        <span class="side ink soft"><span data-t="month"></span><br />${esc(d.year)}</span>
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
      <p class="time ink" data-t="time"></p>
      <p class="count ink soft" id="count"></p>
      <div class="pills">
        <a class="pill" id="calBtn" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></svg><span data-t="addToCalendar"></span></a>
      </div>
    </div>
  </section>

  <section class="page p3" id="p3">
    ${edges}${knots}
    <div class="flow">
      <p class="label ink soft" data-t="venueLabel"></p>
      <svg class="route" viewBox="0 0 80 110" aria-hidden="true">
        <defs><mask id="routeMask"><path class="reveal" d="M14 4 C60 14 66 34 38 46 C12 58 20 76 40 84" pathLength="1" /></mask></defs>
        <path class="trail" d="M14 4 C60 14 66 34 38 46 C12 58 20 76 40 84" mask="url(#routeMask)" />
        <path class="pin" d="M40 108 C40 108 30 98 30 91 A10 10 0 0 1 50 91 C50 98 40 108 40 108Z M40 87.5 A3.5 3.5 0 1 0 40 94.5 A3.5 3.5 0 1 0 40 87.5Z" fill-rule="evenodd" />
      </svg>
      <p class="venue foil" data-t="venueName"></p>
      <p class="addr ink soft">${v.lines.map(esc).join('<br />')}</p>
      <div class="pills">
        <a class="pill solid" id="dirBtn" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l18-8-8 18-2-8-8-2z" /></svg><span data-t="directions"></span></a>
        <a class="pill" href="${v.mapsLink}" target="_blank" rel="noopener" data-t="openInMaps"></a>
      </div>
    </div>
  </section>

  <section class="page p4" id="p4">
    ${edges}${knots}
    <i class="rule-bot l e1"></i><i class="rule-bot r e1"></i><i class="rule-bot l e2"></i><i class="rule-bot r e2"></i>
    <svg class="bow" viewBox="-30 -16 60 32" aria-hidden="true"><path pathLength="1" d="M0 0 C-14 -12 -27 -6 -23 4 C-19 12 -6 6 0 0 C6 6 19 12 23 4 C27 -6 14 -12 0 0" /><path pathLength="1" d="M0 0 C-3 5 -7 9 -12 12 M0 0 C3 5 7 9 12 12" /></svg>
    <div class="flow">
      <div class="couple"><img src="${INVITE.couple.src}" width="${INVITE.couple.width}" height="${INVITE.couple.height}" alt="${esc(n.first)} and ${esc(n.second)}" decoding="async" /></div>
      <p class="with ink soft" data-t="withLove"></p>
      <p class="sign"><span class="foil" data-t="first"></span>${amp}<span class="foil" data-t="second"></span></p>
      <button class="putback" id="putBack" type="button" data-t="putBack"></button>
    </div>
  </section>
</article>`;
}
