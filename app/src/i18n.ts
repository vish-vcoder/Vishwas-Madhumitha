/**
 * Every word on the invitation, in English, Kannada and Tamil. The address stays in English
 * in every language so it matches maps and signboards.
 *
 * Kannada and Tamil place the verb last, so the invitation line is split around the title:
 * `before` lines, then the title, then `after`.
 */
export type Lang = 'en' | 'kn' | 'ta';
export const LANGS: { id: Lang; label: string; short: string }[] = [
  { id: 'en', label: 'English', short: 'En' },
  { id: 'kn', label: 'ಕನ್ನಡ', short: 'ಕ' },
  { id: 'ta', label: 'தமிழ்', short: 'த' },
];

export interface Strings {
  first: string; second: string;
  greeting: (name: string) => string;
  before: string[]; title: string; after: string;
  cue: string; hint: string;
  dateLabel: string; weekday: string; month: string; time: string;
  countdown: (days: number) => string;
  addToCalendar: string;
  venueLabel: string; venueName: string; directions: string; openInMaps: string;
  withLove: string; putBack: string;
  a11y: { seal: string; close: string; mute: string; unmute: string; toIvory: string; toBlack: string; language: string; pages: string };
}

export const STRINGS: Record<Lang, Strings> = {
  en: {
    first: 'Vishwas', second: 'Madhumitha',
    greeting: (n) => `Dear ${n},`,
    before: ['request the pleasure of your company', 'at their'], title: 'Reception Party', after: '',
    cue: 'Scroll', hint: 'Tap the seal',
    dateLabel: 'The evening of', weekday: 'Sunday', month: 'November', time: '6 PM onwards',
    countdown: (d) => (d > 1 ? `${d} days to go` : d === 1 ? 'Tomorrow' : d === 0 ? 'Today · see you at six' : 'Thank you for celebrating with us'),
    addToCalendar: 'Add to calendar',
    venueLabel: 'The venue', venueName: 'Subz Banquet Hall', directions: 'Directions', openInMaps: 'Open in Maps',
    withLove: 'With love,', putBack: 'Put it back in the envelope',
    a11y: { seal: 'Break the seal and open the invitation', close: 'Put the invitation back', mute: 'Mute sounds', unmute: 'Turn sounds on', toIvory: 'Switch to the ivory card', toBlack: 'Switch to the black card', language: 'Language', pages: 'Pages' },
  },
  kn: {
    first: 'ವಿಶ್ವಾಸ್', second: 'ಮಧುಮಿತಾ',
    greeting: (n) => `ಪ್ರೀತಿಯ ${n},`,
    before: ['ತಮ್ಮ ವಿವಾಹದ'], title: 'ಆರತಕ್ಷತೆಗೆ', after: 'ನಿಮ್ಮನ್ನು ಪ್ರೀತಿಯಿಂದ ಆಹ್ವಾನಿಸುತ್ತಾರೆ',
    cue: 'ಮುಂದೆ ಸರಿಸಿ', hint: 'ಮುದ್ರೆಯನ್ನು ಸ್ಪರ್ಶಿಸಿ',
    dateLabel: 'ಸಂಜೆ', weekday: 'ಭಾನುವಾರ', month: 'ನವೆಂಬರ್', time: 'ಸಂಜೆ 6 ಗಂಟೆಯಿಂದ',
    countdown: (d) => (d > 1 ? `ಇನ್ನು ${d} ದಿನಗಳು` : d === 1 ? 'ನಾಳೆ' : d === 0 ? 'ಇಂದು · ಸಂಜೆ ಸಿಗೋಣ' : 'ನಮ್ಮೊಂದಿಗೆ ಸಂಭ್ರಮಿಸಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು'),
    addToCalendar: 'ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಸೇರಿಸಿ',
    venueLabel: 'ಸ್ಥಳ', venueName: 'ಸಬ್ಜ್ ಬ್ಯಾಂಕ್ವೆಟ್ ಹಾಲ್', directions: 'ದಾರಿ ತೋರಿಸಿ', openInMaps: 'ನಕ್ಷೆಯಲ್ಲಿ ತೆರೆಯಿರಿ',
    withLove: 'ಪ್ರೀತಿಯಿಂದ,', putBack: 'ಲಕೋಟೆಗೆ ಹಿಂತಿರುಗಿಸಿ',
    a11y: { seal: 'ಮುದ್ರೆ ತೆರೆದು ಆಮಂತ್ರಣ ನೋಡಿ', close: 'ಆಮಂತ್ರಣವನ್ನು ಹಿಂತಿರುಗಿಸಿ', mute: 'ಧ್ವನಿ ಆಫ್ ಮಾಡಿ', unmute: 'ಧ್ವನಿ ಆನ್ ಮಾಡಿ', toIvory: 'ದಂತ ಬಣ್ಣದ ಕಾರ್ಡ್', toBlack: 'ಕಪ್ಪು ಕಾರ್ಡ್', language: 'ಭಾಷೆ', pages: 'ಪುಟಗಳು' },
  },
  ta: {
    first: 'விஸ்வாஸ்', second: 'மதுமிதா',
    greeting: (n) => `அன்புள்ள ${n},`,
    before: ['தங்கள் திருமண'], title: 'வரவேற்பு விழாவிற்கு', after: 'உங்களை அன்புடன் அழைக்கின்றனர்',
    cue: 'கீழே நகர்த்தவும்', hint: 'முத்திரையைத் தொடவும்',
    dateLabel: 'மாலை', weekday: 'ஞாயிறு', month: 'நவம்பர்', time: 'மாலை 6 மணி முதல்',
    countdown: (d) => (d > 1 ? `இன்னும் ${d} நாட்கள்` : d === 1 ? 'நாளை' : d === 0 ? 'இன்று · மாலை சந்திப்போம்' : 'எங்களுடன் கொண்டாடியதற்கு நன்றி'),
    addToCalendar: 'நாட்காட்டியில் சேர்',
    venueLabel: 'இடம்', venueName: 'சப்ஸ் பேங்க்வெட் ஹால்', directions: 'வழி காட்டு', openInMaps: 'வரைபடத்தில் திற',
    withLove: 'அன்புடன்,', putBack: 'உறைக்குள் திரும்ப வை',
    a11y: { seal: 'முத்திரையை உடைத்து அழைப்பிதழைத் திற', close: 'அழைப்பிதழைத் திரும்ப வை', mute: 'ஒலியை அணை', unmute: 'ஒலியை இயக்கு', toIvory: 'தந்த நிற அட்டை', toBlack: 'கருப்பு அட்டை', language: 'மொழி', pages: 'பக்கங்கள்' },
  },
};
