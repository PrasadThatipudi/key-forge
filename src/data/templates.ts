type Slot =
  | 'subject'
  | 'verb'
  | 'object'
  | 'activity'
  | 'detail'
  | 'location'
  | 'tech'
  | 'time'
  | 'numeral'

export const WORD_POOLS: Record<Slot, readonly string[]> = {
  subject: [
    'Nova',
    'the night editor',
    'two sleepy coders',
    'Mira',
    'a curious intern',
    'Captain Vega',
    'the rover pilot',
    'Riley',
    'an avid typist',
    'the sunrise DJ'
  ],
  verb: [
    'juggles',
    'debugs',
    'sketches',
    'balances',
    'records',
    'maps',
    'tests',
    'calibrates',
    'patches',
    'crafts'
  ],
  object: [
    'glowing dashboards',
    'noisy keystrokes',
    'fresh commit logs',
    'orbit charts',
    'paper coffee orders',
    'status reports',
    'macro scripts',
    'flight plans',
    'draft release notes',
    'pixel grids'
  ],
  activity: [
    'sips espresso',
    'counts down 3-2-1',
    'taps the space bar twice',
    'drums a syncopated beat',
    'hums retro game loops',
    'stretches wrists',
    'shares a sly emoji',
    'checks sync lights',
    'spins the track dial',
    'sketches keyboard rows'
  ],
  detail: [
    'tracking 123-XYZ coordinates',
    'balancing seven open tabs',
    'timing pulses with a neon clock',
    'watching rain bead on glass',
    'echoing through the quiet studio',
    'matching beats to the metronome',
    'measuring latency in ms',
    'counting gigabytes left',
    'matching breaths to the waveform',
    'chasing the midnight deploy'
  ],
  location: [
    'in the glassy control room',
    'under violet tunnel lights',
    'beside the hum of servers',
    'on the 32nd-floor balcony',
    'across the rover bay',
    'near the midnight newsroom',
    'by the waterfront lab',
    'inside the quiet tram car',
    'beneath skylight reflections',
    'along the monorail desk'
  ],
  tech: [
    'API packets',
    'RGB sliders',
    'telemetry bursts',
    'sensor graphs',
    'quantum test rigs',
    'edge cache hits',
    'laser-scanned maps',
    'macro hotkeys',
    'keyboard firmware',
    'battery diagnostics'
  ],
  time: [
    'before sunrise',
    'after the 02:00 chime',
    'as Tuesday flips to Wednesday',
    'during the 90-second sprint',
    'when the clock reads 04:44',
    'at shift change',
    'mid-commute',
    'after the final alert',
    'at golden hour',
    'during the lunch rush'
  ],
  numeral: [
    '42',
    '73',
    '108',
    '256',
    '4800',
    '7.3',
    '99.9',
    '5x',
    '12%',
    '3.14'
  ]
}

export const SENTENCE_TEMPLATES: readonly string[] = [
  '{{subject}} {{verb}} {{object}}, then {{activity}} while {{detail}}.',
  '{{subject}} {{activity}} {{location}} as {{tech}} flicker in sync.',
  '{{time}}, {{subject}} {{verb}} {{tech}} and notes {{numeral}} data points.',
  '{{subject}} lines up {{object}}, {{activity}}, and whispers about {{numeral}} pending tasks.',
  '{{subject}} {{verb}} {{object}} {{location}}, leaving {{numeral}} crisp keystrokes behind.',
  '{{time}} finds {{subject}} {{activity}} while {{detail}}.',
  '{{subject}} threads {{tech}} into {{object}}, then {{activity}} before the clock hits {{numeral}}.'
]

