/**
 * Recorded sound effects through Web Audio: files are fetched in the background and decoded
 * on the first tap, so a cue plays the instant it is asked for. Each cue may have several
 * takes; one is picked at random so repeat opens don't sound canned.
 */
type Cue = 'open' | 'close' | 'shoot' | 'tap';

export function createSound(files: Record<string, string[]>) {
  let ctx: AudioContext | null = null;
  let out: GainNode | null = null;
  let muted = false;
  try { muted = localStorage.getItem('vm-sound') === 'off'; } catch { /* storage blocked */ }
  const raw = new Map<string, Promise<ArrayBuffer | null>>();
  const decoded = new Map<string, AudioBuffer>();

  // Fetch early (cheap, cached); decoding needs the audio context, which needs a tap.
  for (const list of Object.values(files)) for (const f of list) {
    raw.set(f, fetch('sounds/' + f).then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null));
  }

  function unlock() {
    try {
      if (!ctx) {
        // On iPhone, follow the ringer switch like other ambient sounds.
        const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
        if (session) session.type = 'ambient';
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        out = ctx.createGain();
        out.gain.value = 0.9;
        out.connect(ctx.destination);
        for (const [f, p] of raw) p.then((buf) => buf && ctx!.decodeAudioData(buf.slice(0)).then((b) => decoded.set(f, b)).catch(() => {}));
      }
      if (ctx.state === 'suspended') void ctx.resume();
    } catch { /* audio unavailable */ }
  }

  function play(cue: Cue, delay = 0) {
    if (muted || !ctx || !out || ctx.state !== 'running') return;
    const takes = (files[cue] || []).filter((f) => decoded.has(f));
    if (!takes.length) return;
    const src = ctx.createBufferSource();
    src.buffer = decoded.get(takes[Math.floor(Math.random() * takes.length)])!;
    src.connect(out);
    src.start(ctx.currentTime + delay);
  }

  return {
    unlock,
    play,
    get muted() { return muted; },
    setMuted(m: boolean) {
      muted = m;
      try { localStorage.setItem('vm-sound', m ? 'off' : 'on'); } catch { /* storage blocked */ }
    },
  };
}
