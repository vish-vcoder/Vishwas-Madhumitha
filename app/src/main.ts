import '@fontsource/cinzel/400.css';
import '@fontsource/cinzel/500.css';
import '@fontsource/eb-garamond/400.css';
import '@fontsource/eb-garamond/400-italic.css';
import './styles.css';
import { INVITE, countdownText } from './content';
import { letterHTML } from './letter';
import { createSound } from './sound';

/**
 * The flow is a small state machine: sealed → opening → open → closing → sealed.
 * Every motion is a transform or opacity change handed to the browser (Web Animations),
 * so it runs on the graphics chip; the letter pages scroll natively and snap one at a time.
 */
type State = 'sealed' | 'opening' | 'open' | 'closing';

const root = document.documentElement;
const $ = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector(sel) as T;
const params = new URLSearchParams(location.search);
const guest = (params.get('to') || '').replace(/[^\p{L}\p{M} .'&-]/gu, '').trim().slice(0, 40) || null;

const scroller = $('#scroller');
scroller.innerHTML = letterHTML(guest);
const letter = $('#letter');
const pocket = $('#pocket');
const pages = [...document.querySelectorAll<HTMLElement>('.page')];
const envLayers = [...document.querySelectorAll<HTMLElement>('.env')];
const flapLayer = $('.env-flap');
const flap = $('.flap');
const sealTop = $('.seal-top');
const sealBot = $('.seal-bot');
const dots = $('#dots');
const sound = createSound(INVITE.sounds);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const D = (ms: number) => (reduced ? 1 : ms);
const easeOut = 'cubic-bezier(.22,1,.36,1)';
const easeInOut = 'cubic-bezier(.65,0,.35,1)';

let state: State = 'sealed';
let page = 0;
const G = { vw: 0, vh: 0, envW: 0, envH: 0, lw: 0, top: 14, closedY: 0, openY: 0 };

// ── layout: every size derives from the screen; set once per resize ──
function layout() {
  const vw = innerWidth, vh = scroller.clientHeight || innerHeight;
  const envW = Math.min(vw * 0.98, 760, vh * 0.64 * 1.45);
  const envH = envW / 1.45;
  const lw = envW * 0.9;
  const top = 14;
  const closedY = (vh - envH) / 2 - vh * 0.02;
  // The open envelope sits low (lower still on wide screens) so the first page has room.
  const openY = vh - envH * (vw > vh * 1.1 ? 0.36 : 0.6);
  Object.assign(G, { vw, vh, envW, envH, lw, top, closedY, openY });
  const set = (k: string, v: number) => root.style.setProperty(k, v.toFixed(2) + 'px');
  set('--envW', envW); set('--envH', envH); set('--lw', lw); set('--ph', vh); set('--top', top); set('--closedY', closedY);
  // Type scale: fits the letter's width and the page height; page 1 also fits above the envelope.
  set('--tw', Math.min(lw, vh * 0.8));
  set('--tw1', Math.min(lw, (openY - top - 118) / 0.92));
  set('--p1pad', vh - openY + 20);
  set('--cueY', vh - openY - envH * 0.04);
  const pts: string[] = [];
  for (let x = 0; x <= lw; x += 5) pts.push(`${x.toFixed(1)}px ${(Math.random() * 2.2).toFixed(1)}px`);
  root.style.setProperty('--deckle', `polygon(${pts.join(',')}, 100% 100%, 0 100%)`);
  place();
}

/** Where things rest in the current state (no animation). */
function place() {
  const y = state === 'sealed' || state === 'opening' ? G.closedY : G.openY;
  for (const el of envLayers) el.style.transform = `translateY(${y}px)`;
  if (letter.parentElement === pocket) letter.style.transform = `translateY(${state === 'sealed' ? G.top - 14 - 6 : -G.openY}px)`;
  if (state === 'open') scroller.scrollTop = page * G.vh;
}

// ── opening and closing ──
const animate = (el: HTMLElement, frames: Keyframe[], opts: KeyframeAnimationOptions) => {
  const a = el.animate(frames, { fill: 'forwards', ...opts });
  return a.finished.then(() => { try { a.commitStyles(); } catch { /* element detached */ } a.cancel(); });
};
const later = (ms: number) => new Promise((r) => setTimeout(r, ms));
const flapFrames = (from: number, to: number) => [
  { transform: `perspective(1200px) rotateX(${from}deg)` },
  { transform: `perspective(1200px) rotateX(${to}deg)` },
];
// The flap passes behind the letter once it is past upright.
const flapDepth = (open: boolean) => (open
  ? [{ zIndex: 4 }, { zIndex: 4, offset: 0.4 }, { zIndex: 1, offset: 0.41 }, { zIndex: 1 }]
  : [{ zIndex: 1 }, { zIndex: 1, offset: 0.55 }, { zIndex: 4, offset: 0.56 }, { zIndex: 4 }]);

async function open() {
  if (state !== 'sealed') return;
  state = 'opening';
  sound.unlock(); sound.play('open');
  try { navigator.vibrate?.(10); } catch { /* not supported */ }
  root.classList.add('is-opening');
  const rel0 = G.top - 14 - 6, rel1 = -G.openY;
  await Promise.all([
    animate(sealTop, [{ transform: 'none', opacity: 1 }, { transform: 'translateY(-16%) rotate(-9deg)', opacity: 0 }], { duration: D(420), easing: easeOut }),
    animate(sealBot, [{ transform: 'none' }, { transform: 'translateY(4%) rotate(4deg)' }], { duration: D(420), easing: easeOut }),
    animate(flap, flapFrames(0, 180), { duration: D(520), delay: D(90), easing: 'cubic-bezier(.3,.9,.3,1.08)' }),
    animate(flapLayer, flapDepth(true), { duration: D(520), delay: D(90) }),
    ...envLayers.map((el) => animate(el, [{ transform: `translateY(${G.closedY}px)` }, { transform: `translateY(${G.openY}px)` }], { duration: D(950), delay: D(300), easing: easeOut })),
    animate(letter, [{ transform: `translateY(${rel0}px)` }, { transform: `translateY(${rel1}px)` }], { duration: D(950), delay: D(300), easing: easeOut }),
  ]);
  // Hand the letter from the envelope to the scrolling page; it is already in place, so nothing moves.
  letter.style.transform = '';
  scroller.prepend(letter);
  scroller.scrollTop = 0;
  page = 0;
  state = 'open';
  root.classList.remove('is-opening');
  root.classList.add('is-open');
  arrive(0);
}

async function close() {
  if (state !== 'open') return;
  state = 'closing';
  sound.unlock();
  if (scroller.scrollTop > 1) {
    scroller.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    const t0 = performance.now();
    while (scroller.scrollTop > 1 && performance.now() - t0 < 1600) await new Promise(requestAnimationFrame);
  }
  root.classList.remove('is-open', 'away');
  for (const p of pages) p.classList.remove('in', 'seen');
  await later(D(160));
  // Back into the envelope, at exactly the same spot on screen.
  letter.style.transform = `translateY(${-G.openY}px)`;
  pocket.append(letter);
  sound.play('close');
  const rel0 = G.top - 14 - 6;
  await Promise.all([
    ...envLayers.map((el) => animate(el, [{ transform: `translateY(${G.openY}px)` }, { transform: `translateY(${G.closedY}px)` }], { duration: D(700), easing: easeInOut })),
    animate(letter, [{ transform: `translateY(${-G.openY}px)` }, { transform: `translateY(${rel0}px)` }], { duration: D(700), easing: easeInOut }),
    animate(flap, flapFrames(180, 0), { duration: D(460), delay: D(520), easing: easeInOut }),
    animate(flapLayer, flapDepth(false), { duration: D(460), delay: D(520) }),
    animate(sealTop, [{ transform: 'translateY(-16%) rotate(-9deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: D(320), delay: D(900), easing: easeOut }),
    animate(sealBot, [{ transform: 'translateY(4%) rotate(4deg)' }, { transform: 'none' }], { duration: D(320), delay: D(900), easing: easeOut }),
  ]);
  state = 'sealed';
}

// ── pages: native scrolling that settles on one page at a time ──
dots.innerHTML = pages.map((_, i) => `<button type="button" aria-label="Page ${i + 1}"></button>`).join('');
const dotEls = [...dots.children] as HTMLElement[];
dotEls.forEach((d, i) => d.addEventListener('click', () => scroller.scrollTo({ top: i * G.vh, behavior: 'smooth' })));

function arrive(i: number) {
  page = i;
  pages.forEach((p, k) => { p.classList.toggle('in', k === i); if (k <= i) p.classList.add('seen'); });
  dotEls.forEach((d, k) => d.toggleAttribute('aria-current', k === i));
  if (i === 1) {
    // One shooting star each time the evening arrives.
    const s = $('.shooter');
    s.classList.remove('go'); void s.getBoundingClientRect(); s.classList.add('go');
    sound.play('shoot', 0.5);
  }
}

/**
 * One page per gesture. The finger drags the letter natively (so it feels like scrolling);
 * on release, any deliberate swipe glides exactly one page that way. Wheels, trackpads and
 * keys step one page per gesture, ignoring the trackpad's trailing momentum.
 */
const settleTo = (i: number) => {
  const target = Math.max(0, Math.min(pages.length - 1, i));
  scroller.scrollTo({ top: target * G.vh, behavior: reduced ? 'auto' : 'smooth' });
};
let touchY = 0, touchPage = 0;
scroller.addEventListener('touchstart', (e) => { touchY = e.touches[0].clientY; touchPage = Math.round(scroller.scrollTop / G.vh); }, { passive: true });
scroller.addEventListener('touchend', (e) => {
  const dy = touchY - e.changedTouches[0].clientY;
  settleTo(Math.abs(dy) > 32 ? touchPage + Math.sign(dy) : touchPage);
}, { passive: true });
let wheelQuietUntil = 0;
scroller.addEventListener('wheel', (e) => {
  if (state !== 'open') return;
  e.preventDefault();
  const now = performance.now();
  const busy = now < wheelQuietUntil;
  wheelQuietUntil = Math.max(wheelQuietUntil, now + 220); // a gesture lasts until the wheel goes quiet
  if (busy || Math.abs(e.deltaY) < 3) return;
  wheelQuietUntil = now + 800;
  settleTo(Math.round(scroller.scrollTop / G.vh) + Math.sign(e.deltaY));
}, { passive: false });
addEventListener('keydown', (e) => {
  if (state !== 'open') return;
  const step = ({ ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 } as Record<string, number>)[e.key];
  if (!step) return;
  e.preventDefault();
  settleTo(Math.round(scroller.scrollTop / G.vh) + step);
});

let ticking = false, idle = 0;
scroller.addEventListener('scroll', () => {
  root.classList.add('moving');
  clearTimeout(idle);
  idle = window.setTimeout(() => root.classList.remove('moving'), 160);
  if (ticking || state !== 'open') return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    root.classList.toggle('away', scroller.scrollTop > 8);
    const i = Math.round(scroller.scrollTop / G.vh);
    if (i !== page) arrive(i);
  });
}, { passive: true });

// ── the seal breathes and lets out a few gold specks while it waits ──
const specks = $('#specks');
function puff() {
  if (state !== 'sealed' || document.hidden || reduced) return;
  for (let n = 0; n < 5; n++) {
    const s = document.createElement('i');
    const side = Math.random() < 0.5 ? -1 : 1, t = 0.15 + Math.random() * 0.7;
    s.style.left = `${50 + side * 50 * (1 - t)}%`;
    s.style.top = `${60 * t}%`;
    s.style.setProperty('--dx', `${side * (8 + Math.random() * 14)}px`);
    s.style.setProperty('--dy', `${-(18 + Math.random() * 26)}px`);
    s.style.animationDelay = `${Math.random() * 400}ms`;
    specks.append(s);
    setTimeout(() => s.remove(), 2400);
  }
}
setTimeout(puff, 900);
setInterval(puff, 3600);

// ── gold that catches the light: follows the pointer on desktop, sweeps gently on phones ──
if (matchMedia('(hover: hover)').matches) {
  let raf = 0;
  addEventListener('pointermove', (e) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => letter.style.setProperty('--lx', (e.clientX / innerWidth).toFixed(3)));
  });
} else {
  root.classList.add('sweep');
}

// ── theme and sound toggles ──
const modeBtn = $('#mode'), soundBtn = $('#sound');
function setTheme(t: 'light' | 'dark') {
  root.dataset.theme = t;
  modeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to the ivory card' : 'Switch to the black card');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#141317' : '#f6ebec');
  try { localStorage.setItem('vm-theme', t); } catch { /* storage blocked */ }
}
setTheme(root.dataset.theme === 'light' ? 'light' : 'dark');
modeBtn.addEventListener('click', () => { sound.unlock(); sound.play('tap'); setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'); });
const showSound = () => { soundBtn.setAttribute('aria-pressed', String(sound.muted)); soundBtn.setAttribute('aria-label', sound.muted ? 'Turn sounds on' : 'Mute sounds'); };
showSound();
soundBtn.addEventListener('click', () => { sound.unlock(); sound.setMuted(!sound.muted); showSound(); sound.play('tap'); });

// ── details ──
const today = new Intl.DateTimeFormat('en-CA', { timeZone: INVITE.date.timeZone }).format(new Date());
$('#count').textContent = countdownText(Math.round((Date.parse(INVITE.date.iso) - Date.parse(today)) / 864e5));
const apple = /iPhone|iPad|Macintosh/.test(navigator.userAgent);
$<HTMLAnchorElement>('#calBtn').href = apple ? INVITE.date.icsFile : 'https://calendar.google.com/calendar/render?' + new URLSearchParams({
  action: 'TEMPLATE', text: INVITE.date.calendarTitle, dates: `${INVITE.date.startUtc}/${INVITE.date.endUtc}`,
  location: `${INVITE.venue.name}, ${INVITE.venue.lines.join(', ')}`,
});
$<HTMLAnchorElement>('#dirBtn').href = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(INVITE.venue.directionsTo);

$('#seal').addEventListener('click', open);
$('#close').addEventListener('click', close);
$('#putBack').addEventListener('click', close);
addEventListener('keydown', (e) => { if (e.key === 'Escape') void close(); });

pocket.append(letter);
let resizeT = 0;
addEventListener('resize', () => { clearTimeout(resizeT); resizeT = window.setTimeout(layout, 120); });
layout();
document.fonts?.ready.then(layout);
root.classList.add('ready');
