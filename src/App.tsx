import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { getParagraph, getRandomParagraphIndex } from './data/paragraphs'
import './App.css'

type CharState = 'pending' | 'current' | 'correct' | 'incorrect'

const formatNumber = (value: number) => Math.max(0, Math.round(value * 10) / 10)

function App() {
  const [paragraphIndex, setParagraphIndex] = useState(() => getRandomParagraphIndex(null))
  const paragraph = getParagraph(paragraphIndex)

  const [typed, setTyped] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())

  const typingRef = useRef<HTMLTextAreaElement>(null)

  const isComplete = typed.length === paragraph.length && paragraph.length > 0

  useEffect(() => {
    typingRef.current?.focus()
  }, [paragraphIndex])

  useEffect(() => {
    if (!startTime || (isComplete && endTime)) {
      return
    }

    const tick = window.setInterval(() => {
      setNow(Date.now())
    }, 100)

    return () => window.clearInterval(tick)
  }, [startTime, isComplete, endTime])

  const { charStates, correctCount } = useMemo(() => {
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

  const elapsedMs = startTime ? ((isComplete && endTime ? endTime : now) - startTime) : 0

  const wpm = startTime && elapsedMs > 0 ? (typed.length / 5) / (elapsedMs / 60000) : 0
  const accuracy = typed.length ? (correctCount / typed.length) * 100 : 100
  const errorCount = Math.max(0, typed.length - correctCount)

  const resetSession = useCallback(() => {
    setTyped('')
    setStartTime(null)
    setEndTime(null)
    setNow(Date.now())
    setParagraphIndex((prev) => getRandomParagraphIndex(prev))
  }, [])

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.target.value.slice(0, paragraph.length)
    if (!startTime && nextValue.length > 0) {
      setStartTime(Date.now())
    }
    setTyped(nextValue)

    if (nextValue.length === paragraph.length && startTime && !endTime) {
      setEndTime(Date.now())
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.metaKey && event.key === 'Enter') {
      event.preventDefault()
      if (isComplete) {
        resetSession()
      }
    }
    if (event.key === 'Tab') {
      event.preventDefault()
    }
  }

  useEffect(() => {
    const handleGlobalShortcut = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === 'Enter' && isComplete) {
        event.preventDefault()
        resetSession()
      }
    }

    window.addEventListener('keydown', handleGlobalShortcut)
    return () => window.removeEventListener('keydown', handleGlobalShortcut)
  }, [isComplete, resetSession])

  return (
    <div className="page" onClick={() => typingRef.current?.focus()}>
      <header className="hero hero--compact">
        <div className="hero__badge">KeyForge</div>
        <p className="hero__hint">Type the paragraph. Press ⌘ + Enter for a fresh one.</p>
      </header>

      <main className="practice-card">
        <section className="paragraph" aria-label="Typing assignment">
          {paragraph.split('').map((char, index) => (
            <span key={`char-${index}`} className={`char char--${charStates[index] ?? 'pending'}`}>
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
            <p className="result-card__title">Paragraph complete!</p>
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
            <p className="result-card__hint">Press ⌘ + Enter anytime to jump into a fresh paragraph.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
