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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {/* NSW Logo area */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <svg width="36" height="30" viewBox="0 0 120 102" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 102C60 102 10 70 10 38C10 20 24 8 40 12C46 14 52 18 60 26C68 18 74 14 80 12C96 8 110 20 110 38C110 70 60 102 60 102Z" fill="#E8192C"/>
            <path d="M60 85C60 85 22 60 22 38C22 26 32 18 44 22C50 24 55 28 60 34C65 28 70 24 76 22C88 18 98 26 98 38C98 60 60 85 60 85Z" fill="#E8192C" opacity="0.7"/>
          </svg>
          <span className="text-white text-3xl font-bold tracking-widest">NSW</span>
        </div>
        <p className="text-gray-400 text-sm tracking-wider">DIGITAL LICENCE</p>
      </div>

      <p className="text-white text-lg mb-6 font-light">Enter your PIN</p>

      {/* PIN dots */}
      <div className={`flex gap-4 mb-2 ${shake ? 'animate-shake' : ''}`}>
        {[0,1,2,3].map(i => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
              pin.length > i
                ? error ? 'bg-red-600 border-red-600' : 'bg-white border-white'
                : 'border-gray-600 bg-transparent'
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
              className="h-16 rounded-2xl bg-gray-900 text-white text-xl flex items-center justify-center active:bg-gray-700 transition-colors"
            >
              ⌫
            </button>
          )
          return (
            <button
              key={i}
              onClick={() => press(k)}
              className="h-16 rounded-2xl bg-gray-900 text-white text-2xl font-light flex items-center justify-center active:bg-gray-700 transition-colors"
            >
              {k}
            </button>
          )
        })}
      </div>

      <p className="text-gray-600 text-xs mt-8">Hint: PIN is 1234</p>
    </div>
  )
}
