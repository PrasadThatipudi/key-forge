const PARAGRAPHS = [
  'Swift thumbs paint zigzag stories across the screen, mixing jazz, trivia, and quirky punctuation like ?! and @ in one breath.',
  'Pack my box with five dozen liquor jugs; then toss in 7 quartz crystals, 3 brass keys, and a splash of midnight ink.',
  'Just before sunrise, Quinn typed "HELLO WORLD 42!" and laughed as the keyboard echoed every clack into the quiet room.',
  'Lazy foxes rarely jump, yet I still stretch J, K, and L while counting 8, 9, 0 in rhythm with crisp winter breaths.',
  'Mixing espresso shots at 6 AM, Zoya hums upbeat tunes and types vibrant code that links APIs, JSON, and UI polish.',
  'Vivid neon signs blink "TYPE FAST" as commuters sip chai, flip pages, and chase deadlines with well-placed semicolons.',
  'When the storm hit, Max wrote calm status updates: "All systems OK; backups synced; uptime 99.99%," easing every mind.',
  'Juggling quotes, brackets, and braces, Riley crafts email drafts that read like poetry yet still ship bug fixes by noon.',
  'Captain Vega mapped icy orbits, typing 123-ABC coordinates, while autopilot hummed and comet dust glittered in zero-g.',
  'The library owl hooted softly as Mia practiced staggered keystrokes, tracing every row from Q to / without missing beat.',
  'Guitar riffs, bold coffee, and the scent of rain push Nova to write crisp commit messages: "Refactor auth; add tests."',
  'Seven playful kittens raced over the keyboard, leaving trails of $$$, %% signs, and LOLs before finally napping on ESC.',
]

export const getRandomParagraphIndex = (previousIndex: number | null) => {
  if (PARAGRAPHS.length === 1) {
    return 0
  }

  let nextIndex = Math.floor(Math.random() * PARAGRAPHS.length)
  while (nextIndex === previousIndex) {
    nextIndex = Math.floor(Math.random() * PARAGRAPHS.length)
  }
  return nextIndex
}

export const getParagraph = (index: number) => PARAGRAPHS[index]

export const paragraphCount = PARAGRAPHS.length

