import { useState, useEffect } from 'react'

const CORRECT_PIN = '1234'

export default function PinEntry({ onSuccess }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === CORRECT_PIN) {
        setTimeout(onSuccess, 200)
      } else {
        setError(true)
        setShake(true)
        setTimeout(() => {
          setPin('')
          setError(false)
          setShake(false)
        }, 800)
      }
    }
  }, [pin, onSuccess])

  const press = (digit) => {
    if (pin.length < 4 && !shake) setPin(p => p + digit)
  }

  const backspace = () => {
    if (!shake) setPin(p => p.slice(0, -1))
  }

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  return (
    <div className="min-h-screen bg-nsw-navy flex flex-col items-center justify-center p-6">
      {/* NSW Logo area */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-1.5 h-8 bg-nsw-red rounded-sm" />
          <span className="text-white text-3xl font-bold tracking-widest">NSW</span>
        </div>
        <p className="text-blue-200 text-sm tracking-wider">DIGITAL LICENCE</p>
      </div>

      <p className="text-white text-lg mb-6 font-light">Enter your PIN</p>

      {/* PIN dots */}
      <div className={`flex gap-4 mb-2 ${shake ? 'animate-shake' : ''}`}>
        {[0,1,2,3].map(i => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
              pin.length > i
                ? error ? 'bg-nsw-red border-nsw-red' : 'bg-white border-white'
                : 'border-gray-400 bg-transparent'
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-nsw-red text-sm mb-4 h-5">Incorrect PIN</p>
      )}
      {!error && <div className="h-9" />}

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-3 w-72">
        {keys.map((k, i) => {
          if (k === '') return <div key={i} />
          if (k === '⌫') return (
            <button
              key={i}
              onClick={backspace}
              className="h-16 rounded-2xl bg-blue-900 text-white text-xl flex items-center justify-center active:bg-blue-800 transition-colors"
            >
              ⌫
            </button>
          )
          return (
            <button
              key={i}
              onClick={() => press(k)}
              className="h-16 rounded-2xl bg-blue-900 text-white text-2xl font-light flex items-center justify-center active:bg-blue-800 transition-colors"
            >
              {k}
            </button>
          )
        })}
      </div>

      <p className="text-blue-400 text-xs mt-8">Hint: PIN is 1234</p>
    </div>
  )
}
