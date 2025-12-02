export type RowId = 'home' | 'top' | 'bottom' | 'numbers' | 'caps' | 'symbols' | 'mixed'

export type RowDefinition = {
  id: RowId
  label: string
  characters: readonly string[]
}

export const ROW_DEFINITIONS: RowDefinition[] = [
  {
    id: 'home',
    label: 'Home row',
    characters: ['f', 'j', 'd', 'k', 's', 'l', 'a', ';', 'g', 'h']
  },
  {
    id: 'top',
    label: 'Top row',
    characters: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
  },
  {
    id: 'bottom',
    label: 'Bottom row',
    characters: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.']
  },
  {
    id: 'numbers',
    label: 'Number row',
    characters: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
  },
  {
    id: 'caps',
    label: 'Capital row',
    characters: ['F', 'J', 'D', 'K', 'S', 'L', 'A', 'G', 'H']
  },
  {
    id: 'symbols',
    label: 'Symbols',
    characters: ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+']
  },
  {
    id: 'mixed',
    label: 'Mixed row',
    characters: ['f', 'j', 'd', 'k', 's', 'l', 'a', ';', '1', '2', '3', '!', '@']
  }
]

const CHUNK_PATTERNS = [1, 2, 3, 4]
const TARGET_LENGTH = 120

const repeatPattern = (characters: readonly string[]) => {
  const output: string[] = []
  let index = Math.floor(Math.random() * characters.length)
  let totalLength = 0

  while (totalLength < TARGET_LENGTH + 10) {
    const chunkLength = CHUNK_PATTERNS[Math.floor(Math.random() * CHUNK_PATTERNS.length)]
    const char = characters[index % characters.length]
    const chunk = char.repeat(chunkLength)
    output.push(chunk)
    totalLength += chunk.length + 1 // account for space
    index += 1
  }

  return output.join(' ')
}

export const createCharacterSequence = (rowId: RowId) => {
  const row = ROW_DEFINITIONS.find((definition) => definition.id === rowId)
  if (!row) {
    throw new Error(`Unknown row: ${rowId}`)
  }
  return repeatPattern(row.characters).slice(0, TARGET_LENGTH)
}

export const availableRows = ROW_DEFINITIONS

