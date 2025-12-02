import { useCallback, useMemo, useState } from 'react'
import { availableRows, createCharacterSequence } from '../data/characters'

type CharState = 'pending' | 'current' | 'correct' | 'incorrect'
export type RowId = (typeof availableRows)[number]['id']

const ROW_SEQUENCE: RowId[] = availableRows.map((row) => row.id)

const getNextRowId = (current: RowId): RowId => {
  const index = ROW_SEQUENCE.indexOf(current)
  return ROW_SEQUENCE[(index + 1) % ROW_SEQUENCE.length]
}

export const useCharacterDrill = (typed: string) => {
  const [rowId, setRowId] = useState<RowId>(ROW_SEQUENCE[0])
  const [sequence, setSequence] = useState(() => createCharacterSequence(rowId))

  const refreshSequence = useCallback(
    (nextRow: RowId) => {
      setRowId(nextRow)
      setSequence(createCharacterSequence(nextRow))
    },
    []
  )

  const reset = useCallback(() => {
    refreshSequence(getNextRowId(rowId))
  }, [refreshSequence, rowId])

  const { charStates, correctCount } = useMemo(() => {
    const states: CharState[] = []
    let correct = 0

    for (let i = 0; i < sequence.length; i += 1) {
      const target = sequence[i]
      const input = typed[i]

      if (input === undefined) {
        states.push(i === typed.length ? 'current' : 'pending')
        continue
      }

      if (input === target) {
        states.push('correct')
        correct += 1
      } else {
        states.push('incorrect')
      }
    }

    return { charStates: states, correctCount: correct }
  }, [sequence, typed])

  return {
    rowId,
    sequence,
    reset,
    charStates,
    correctCount,
    jumpToRow: refreshSequence
  }
}

