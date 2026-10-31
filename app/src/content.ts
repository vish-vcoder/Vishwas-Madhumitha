/**
 * Everything specific to this invitation lives here. To reuse the template for another
 * event, change this file (and the art in public/art, public/couple.webp).
 */
export const INVITE = {
  names: { first: 'Vishwas', second: 'Madhumitha', initials: 'VM' },
  /** The guest's name comes from the link: …/?to=Ananya */
  greeting: (name: string) => `Dear ${name},`,
  invite: ['request the pleasure of your company', 'at their'],
  title: 'Reception Party',
  date: {
    label: 'The evening of',
    weekday: 'Sunday',
    day: '29',
    month: 'November',
    year: '2026',
    iso: '2026-11-29',
    time: '6 PM onwards',
    timeZone: 'Asia/Kolkata',
    /** Calendar entry, in UTC: 6 PM – 11 PM IST */
    startUtc: '20261129T123000Z',
    endUtc: '20261129T173000Z',
    calendarTitle: 'Reception · Vishwas & Madhumitha',
    icsFile: 'reception.ics',
  },
  venue: {
    label: 'The venue',
    name: 'Subz Banquet Hall',
    lines: ['3rd Floor, Cosmopolitan Club', '22nd Cross Road, Jayanagar 3rd Block', 'Bengaluru 560011'],
    mapsLink: 'https://maps.google.com/?cid=13298904705969542961',
    directionsTo: 'Subz Banquet Hall, Cosmopolitan Club, Jayanagar 3rd Block, Bengaluru 560011',
  },
  signoff: 'With love,',
  couple: { src: 'couple.webp', width: 640, height: 985 },
  /** Recorded sound effects in public/sounds; each cue picks one of its takes at random. */
  // Filled in once the recordings are chosen, e.g. open: ['open-1.m4a', 'open-2.m4a'].
  sounds: { open: [], close: [], shoot: [], tap: [] } as Record<string, string[]>,
};

export function countdownText(days: number): string {
  if (days > 1) return `${days} days to go`;
  if (days === 1) return 'Tomorrow';
  if (days === 0) return 'Today · see you at six';
  return 'Thank you for celebrating with us';
}
