import { SENTENCE_TEMPLATES, WORD_POOLS } from './templates'

type Slot = keyof typeof WORD_POOLS

const SLOT_PATTERN = /{{(.*?)}}/g
const MIN_SENTENCES = 3
const MAX_SENTENCES = 5
const TARGET_CHAR_LENGTH = 120

type SlotPick = {
  slot: Slot
  index: number
  value: string
}

const randomIndex = (length: number) => Math.floor(Math.random() * length)

const pickFromPool = (slot: Slot, previous?: string): SlotPick => {
  const pool = WORD_POOLS[slot]
  if (!pool || pool.length === 0) {
    throw new Error(`Missing pool for slot "${slot}"`)
  }

  let index = randomIndex(pool.length)
  if (pool.length > 1) {
    while (pool[index] === previous) {
      index = randomIndex(pool.length)
    }
  }

  return { slot, index, value: pool[index] }
}

const sentenceCase = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }

  return trimmed[0].toUpperCase() + trimmed.slice(1)
}

const fillTemplate = (
  template: string,
  previousWords: Partial<Record<Slot, string>>
): { sentence: string; picks: SlotPick[] } => {
  const picks: SlotPick[] = []

  const sentence = template.replace(SLOT_PATTERN, (_, rawSlot: string) => {
    const slot = rawSlot.trim() as Slot
    if (!WORD_POOLS[slot]) {
      throw new Error(`Unknown slot "${slot}" in template "${template}"`)
    }

    const pick = pickFromPool(slot, previousWords[slot])
    previousWords[slot] = pick.value
    picks.push(pick)
    return pick.value
  })

  return { sentence: sentenceCase(sentence), picks }
}

export type GeneratedParagraph = { text: string; seed: string }

const buildParagraph = (): GeneratedParagraph => {
  const sentences: string[] = []
  const seedParts: string[] = []
  const previousWords: Partial<Record<Slot, string>> = {}

  while (
    (sentences.length < MIN_SENTENCES ||
      sentences.join(' ').length < TARGET_CHAR_LENGTH) &&
    sentences.length < MAX_SENTENCES
  ) {
    const templateIndex = randomIndex(SENTENCE_TEMPLATES.length)
    const template = SENTENCE_TEMPLATES[templateIndex]
    const { sentence, picks } = fillTemplate(template, previousWords)
    sentences.push(sentence)

    seedParts.push(`t${templateIndex}`)
    picks.forEach((pick) => {
      seedParts.push(`${pick.slot}:${pick.index}`)
    })
  }

  return { text: sentences.join(' '), seed: seedParts.join('|') }
}

export const generateParagraph = (previousSeed?: string): GeneratedParagraph => {
  let attempt = 0
  let result = buildParagraph()

  while (result.seed === previousSeed && attempt < 5) {
    result = buildParagraph()
    attempt += 1
  }

  return result
}

