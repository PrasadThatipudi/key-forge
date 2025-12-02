import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { generateParagraph } from './data/paragraphs'
import { availableRows } from './data/characters'
import { useCharacterDrill } from './hooks/useCharacterDrill'
import './App.css'

type CharState = 'pending' | 'current' | 'correct' | 'incorrect'
type PracticeMode = 'characters' | 'paragraph'

const formatNumber = (value: number) => Math.max(0, Math.round(value * 10) / 10)

function App() {
  const [mode, setMode] = useState<PracticeMode>('characters')
  const [paragraphData, setParagraphData] = useState(() => generateParagraph())
  const paragraph = paragraphData.text
  const [typed, setTyped] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())

  const {
    rowId,
    sequence,
    reset: cycleCharacterRow,
    jumpToRow,
    charStates: characterStates,
    correctCount: characterCorrectCount
  } = useCharacterDrill(typed)

  const targetText = mode === 'characters' ? sequence : paragraph
  const targetLength = targetText.length

  const rowLabel = useMemo(() => {
    const definition = availableRows.find((row) => row.id === rowId)
    return definition?.label ?? 'Home row'
  }, [rowId])

  const nextRowLabel = useMemo(() => {
    const index = availableRows.findIndex((row) => row.id === rowId)
    const next = availableRows[(index + 1) % availableRows.length]
    return next?.label ?? rowLabel
  }, [rowId, rowLabel])

  const typingRef = useRef<HTMLTextAreaElement>(null)

  const isComplete = typed.length === targetLength && targetLength > 0

  useEffect(() => {
    typingRef.current?.focus()
  }, [mode, paragraphData.seed, sequence])

  useEffect(() => {
    if (!startTime || (isComplete && endTime)) {
      return
    }

    const tick = window.setInterval(() => {
      setNow(Date.now())
    }, 100)

    return () => window.clearInterval(tick)
  }, [startTime, isComplete, endTime])

  const { charStates: paragraphCharStates, correctCount: paragraphCorrectCount } = useMemo(() => {
    const states: CharState[] = []
    let correct = 0

    for (let i = 0; i < paragraph.length; i += 1) {
      const target = paragraph[i]
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
  }, [paragraph, typed])

  const activeCharStates = mode === 'characters' ? characterStates : paragraphCharStates
  const correctCount = mode === 'characters' ? characterCorrectCount : paragraphCorrectCount

  const elapsedMs = startTime ? ((isComplete && endTime ? endTime : now) - startTime) : 0

  const wpm = startTime && elapsedMs > 0 ? (typed.length / 5) / (elapsedMs / 60000) : 0
  const accuracy = typed.length ? (correctCount / typed.length) * 100 : 100
  const errorCount = Math.max(0, typed.length - correctCount)

  const resetSession = useCallback(() => {
    setTyped('')
    setStartTime(null)
    setEndTime(null)
    setNow(Date.now())
    if (mode === 'characters') {
      cycleCharacterRow()
    } else {
      setParagraphData((prev) => generateParagraph(prev.seed))
    }
  }, [mode, cycleCharacterRow])

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.target.value.slice(0, targetLength)
    if (!startTime && nextValue.length > 0) {
      setStartTime(Date.now())
    }
    setTyped(nextValue)

    if (nextValue.length === targetLength && startTime && !endTime) {
      setEndTime(Date.now())
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.metaKey && event.key === 'Enter') {
      event.preventDefault()
      resetSession()
    }
    if (event.key === 'Tab') {
      event.preventDefault()
    }
  }

  useEffect(() => {
    const handleGlobalShortcut = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === 'Enter') {
        event.preventDefault()
        resetSession()
      }
    }

    window.addEventListener('keydown', handleGlobalShortcut)
    return () => window.removeEventListener('keydown', handleGlobalShortcut)
  }, [resetSession])

  const handleModeChange = (nextMode: PracticeMode) => {
    if (nextMode === mode) {
      return
    }
    setMode(nextMode)
    setTyped('')
    setStartTime(null)
    setEndTime(null)
    setNow(Date.now())
    if (nextMode === 'characters') {
      jumpToRow(rowId)
    } else {
      setParagraphData(generateParagraph())
    }
  }

  return (
    <div className="page" onClick={() => typingRef.current?.focus()}>
      <header className="hero hero--compact">
        <div className="hero__badge">KeyForge</div>
        <p className="hero__hint">Cycle through every keyboard row or jump into full paragraphs.</p>
        <div className="mode-toggle" role="group" aria-label="Practice mode">
          <button
            type="button"
            className={`mode-toggle__button ${mode === 'characters' ? 'mode-toggle__button--active' : ''}`}
            onClick={() => handleModeChange('characters')}
          >
            Characters
          </button>
          <button
            type="button"
            className={`mode-toggle__button ${mode === 'paragraph' ? 'mode-toggle__button--active' : ''}`}
            onClick={() => handleModeChange('paragraph')}
          >
            Paragraph
          </button>
        </div>
        {mode === 'characters' && (
          <div className="row-indicator" aria-live="polite">
            <div className="row-indicator__pill">
              <span className="row-indicator__label">Current row</span>
              <span className="row-indicator__value">{rowLabel}</span>
            </div>
            <span className="row-indicator__next">Next: {nextRowLabel}</span>
          </div>
        )}
      </header>

      <main className="practice-card">
        <section className="paragraph" aria-label="Typing assignment">
          {targetText.split('').map((char, index) => (
            <span key={`char-${index}`} className={`char char--${activeCharStates[index] ?? 'pending'}`}>
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </section>

        <textarea
          ref={typingRef}
          className="typing-input"
          value={typed}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={(event) => event.preventDefault()}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="none"
          aria-label="Hidden typing input"
          tabIndex={-1}
        />

        <section className="stats">
          <div>
            <p className="stats__label">WPM</p>
            <p className="stats__value">{formatNumber(wpm)}</p>
          </div>
          <div>
            <p className="stats__label">Accuracy</p>
            <p className="stats__value">{formatNumber(accuracy)}%</p>
          </div>
          <div>
            <p className="stats__label">Errors</p>
            <p className="stats__value">{errorCount}</p>
          </div>
          <div>
            <p className="stats__label">Time</p>
            <p className="stats__value">{(elapsedMs / 1000).toFixed(1)}s</p>
          </div>
        </section>

        {isComplete && (
          <div className="result-card" role="status" aria-live="polite">
            <p className="result-card__title">
              {mode === 'characters' ? 'Sequence complete!' : 'Paragraph complete!'}
            </p>
            <div className="result-card__grid">
              <div>
                <span className="result-card__label">Speed</span>
                <span className="result-card__number">{formatNumber(wpm)} WPM</span>
              </div>
              <div>
                <span className="result-card__label">Accuracy</span>
                <span className="result-card__number">{formatNumber(accuracy)}%</span>
              </div>
            </div>
            <p className="result-card__hint">
              {mode === 'characters'
                ? `Next row: ${nextRowLabel}. Press ⌘ + Enter to continue.`
                : 'Press ⌘ + Enter anytime to load another paragraph.'}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
