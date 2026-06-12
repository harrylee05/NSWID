import { useState } from 'react'
import { mockUser } from '../data/mockUser'

function PhotoPlaceholder() {
  return (
    <div className="w-24 h-28 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 100 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="120" fill="#D1D5DB"/>
        <circle cx="50" cy="42" r="22" fill="#9CA3AF"/>
        <ellipse cx="50" cy="105" rx="35" ry="28" fill="#9CA3AF"/>
      </svg>
    </div>
  )
}

function MaskedField({ value, label }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="mb-2" onClick={() => setRevealed(r => !r)}>
      <p className="text-blue-300 text-xs uppercase tracking-wider">{label}</p>
      <p className={`text-white text-sm font-medium transition-all duration-200 ${!revealed ? 'blur-sm select-none' : ''}`}>
        {value}
      </p>
      {!revealed && <p className="text-blue-400 text-xs mt-0.5">Tap to reveal</p>}
    </div>
  )
}

function DaysUntilExpiry({ date }) {
  const days = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24))
  const valid = days > 0
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${valid ? 'bg-green-500 text-white' : 'bg-nsw-red text-white'}`}>
      {valid ? `Valid · ${days}d remaining` : 'EXPIRED'}
    </span>
  )
}

export default function IDCard({ onLock }) {
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleVerifyStart = () => {
    setVerifying(true)
    const timer = setTimeout(() => {
      setVerified(true)
      setTimeout(() => {
        setVerified(false)
        setVerifying(false)
      }, 2000)
    }, 1500)
    return () => clearTimeout(timer)
  }

  const handleVerifyEnd = () => {
    if (!verified) setVerifying(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Card */}
      <div className="w-full max-w-sm bg-nsw-navy rounded-2xl shadow-2xl overflow-hidden relative">

        {/* Verified overlay */}
        {verified && (
          <div className="absolute inset-0 bg-green-600 bg-opacity-95 flex flex-col items-center justify-center z-10 rounded-2xl">
            <svg className="w-20 h-20 text-white mb-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-white text-2xl font-bold tracking-widest">VERIFIED</p>
            <p className="text-green-200 text-sm mt-1">Identity Confirmed</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b border-blue-800">
          <div className="flex items-center gap-1.5 mr-3">
            <div className="w-1 h-6 bg-nsw-red rounded-sm" />
            <span className="text-white text-xl font-bold tracking-widest">NSW</span>
          </div>
          <div>
            <p className="text-white text-xs font-semibold tracking-widest">DIGITAL LICENCE</p>
            <p className="text-blue-300 text-xs">Government of New South Wales</p>
          </div>
          <button onClick={onLock} className="ml-auto text-blue-400 hover:text-white transition-colors text-xs">
            🔒 Lock
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex gap-4">
          {/* Photo */}
          <div className="flex-shrink-0">
            <PhotoPlaceholder />
            <div className="mt-2 text-center">
              <span className="bg-nsw-red text-white text-xs font-bold px-2 py-0.5 rounded">
                CLASS {mockUser.licenceClass}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-lg font-bold leading-tight">
              {mockUser.firstName}
            </p>
            <p className="text-white text-lg font-bold leading-tight mb-3">
              {mockUser.lastName.toUpperCase()}
            </p>

            <MaskedField label="Date of Birth" value={mockUser.dob} />
            <MaskedField label="Licence No." value={mockUser.licenceNumber} />

            <div className="mb-2">
              <p className="text-blue-300 text-xs uppercase tracking-wider">Address</p>
              <p className="text-white text-xs font-medium leading-tight">{mockUser.address}</p>
            </div>

            <div className="mb-2">
              <p className="text-blue-300 text-xs uppercase tracking-wider">Conditions</p>
              <p className="text-white text-xs font-medium">{mockUser.conditions}</p>
            </div>
          </div>
        </div>

        {/* Expiry row */}
        <div className="px-4 pb-2 flex items-center justify-between">
          <div>
            <p className="text-blue-300 text-xs uppercase tracking-wider">Expires</p>
            <p className="text-white text-sm font-medium">{mockUser.expiry}</p>
          </div>
          <DaysUntilExpiry date={mockUser.expiryDate} />
        </div>

        {/* Footer / card number */}
        <div className="bg-blue-950 px-4 py-2 flex items-center justify-between border-t border-blue-800">
          <p className="text-blue-400 text-xs font-mono">{mockUser.cardNumber}</p>
          <div className="flex gap-0.5">
            {Array.from({length: 20}).map((_, i) => (
              <div key={i} className={`h-4 w-0.5 ${i % 3 === 0 ? 'bg-blue-500' : i % 5 === 0 ? 'bg-blue-300' : 'bg-blue-600'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Verify button */}
      <div className="mt-6 w-full max-w-sm">
        <button
          onMouseDown={handleVerifyStart}
          onMouseUp={handleVerifyEnd}
          onTouchStart={handleVerifyStart}
          onTouchEnd={handleVerifyEnd}
          className={`w-full py-4 rounded-xl font-semibold tracking-wider text-sm transition-all duration-200 ${
            verifying
              ? 'bg-green-600 text-white scale-95'
              : 'bg-nsw-navy text-white border-2 border-nsw-navy'
          }`}
        >
          {verifying ? 'Verifying...' : 'HOLD TO VERIFY'}
        </button>
        <p className="text-center text-gray-400 text-xs mt-2">Hold button for venue / age verification</p>
      </div>
    </div>
  )
}
