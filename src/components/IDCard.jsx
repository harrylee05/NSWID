import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { mockUser } from '../data/mockUser'
const photoSrc = '/photo.jpg'

function NSWLotus({ size = 40, color = '#E8192C' }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 120 102" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 102C60 102 10 70 10 38C10 20 24 8 40 12C46 14 52 18 60 26C68 18 74 14 80 12C96 8 110 20 110 38C110 70 60 102 60 102Z" fill={color}/>
      <path d="M60 85C60 85 22 60 22 38C22 26 32 18 44 22C50 24 55 28 60 34C65 28 70 24 76 22C88 18 98 26 98 38C98 60 60 85 60 85Z" fill={color} opacity="0.7"/>
      <path d="M60 68C60 68 34 50 34 36C34 28 42 24 50 28C54 30 57 33 60 37C63 33 66 30 70 28C78 24 86 28 86 36C86 50 60 68 60 68Z" fill={color} opacity="0.5"/>
    </svg>
  )
}

function RefreshedTime() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])
  const day = now.getDate()
  const month = now.toLocaleString('en-AU', { month: 'short' })
  const year = now.getFullYear()
  const time = now.toLocaleString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()
  return (
    <div className="text-right leading-tight">
      <p className="text-gray-300 text-xs">Refreshed</p>
      <p className="text-white text-sm font-semibold">{day} {month} {year}</p>
      <p className="text-white text-sm font-semibold">{time}</p>
    </div>
  )
}

function HolographicOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'conic-gradient(from 0deg at 30% 60%, #ff006688, #ff990088, #00ff8888, #0099ff88, #9900ff88, #ff006688)',
        mixBlendMode: 'color',
        animation: 'spin 8s linear infinite',
      }}
    />
  )
}

export default function IDCard({ onLock }) {
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [verifyTimer, setVerifyTimer] = useState(null)

  const handleVerifyStart = () => {
    setVerifying(true)
    const t = setTimeout(() => {
      setVerified(true)
      setTimeout(() => {
        setVerified(false)
        setVerifying(false)
      }, 2500)
    }, 1500)
    setVerifyTimer(t)
  }

  const handleVerifyEnd = () => {
    if (!verified) {
      clearTimeout(verifyTimer)
      setVerifying(false)
    }
  }

  const qrData = JSON.stringify({
    name: `${mockUser.firstName} ${mockUser.lastName}`,
    dob: mockUser.dob,
    licence: mockUser.licenceNumber,
    expiry: mockUser.expiry,
    card: mockUser.cardNumber,
  })

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Verified overlay — full screen */}
      {verified && (
        <div className="fixed inset-0 bg-green-600 bg-opacity-95 flex flex-col items-center justify-center z-50">
          <svg className="w-24 h-24 text-white mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-white text-3xl font-bold tracking-widest">VERIFIED</p>
          <p className="text-green-100 text-base mt-2">Identity Confirmed</p>
        </div>
      )}

      {/* Top yellow diagonal stripe */}
      <div className="relative h-16 overflow-hidden flex-shrink-0">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom right, #F0C020 0%, #F0C020 60%, transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom right, transparent 55%, #1a1a1a 55%)',
          }}
        />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 pb-8">

        {/* NSW logo + Refreshed */}
        <div className="flex items-start justify-between mt-4 mb-4">
          <div className="flex items-center gap-2">
            <NSWLotus size={44} color="#E8192C" />
            <span className="text-white text-xl font-bold tracking-widest">NSW</span>
          </div>
          <RefreshedTime />
        </div>

        {/* Large photo with holographic overlay */}
        <div className="flex justify-center mb-4">
          <div className="relative w-52 h-64 overflow-hidden rounded-sm">
            <img
              src={photoSrc}
              alt="ID Photo"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div
              className="absolute inset-0 bg-gray-700 items-center justify-center text-gray-400 text-sm"
              style={{ display: 'none' }}
            >
              Add photo.jpg to src/assets/
            </div>
            <HolographicOverlay />
          </div>
        </div>

        {/* Full name */}
        <h1 className="text-white text-3xl font-bold text-center mb-5">
          {mockUser.firstName} {mockUser.lastName}
        </h1>

        <div className="border-t border-gray-700 mb-5" />

        {/* Licence number + QR code */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-gray-400 text-sm mb-1">Licence number</p>
            <p className="text-white text-4xl font-bold tracking-wide">{mockUser.licenceNumber}</p>
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-1">Expiry</p>
              <p className="text-white text-3xl font-bold">{mockUser.expiry}</p>
            </div>
          </div>
          <div className="bg-white p-1.5 rounded-sm">
            <QRCodeSVG value={qrData} size={120} />
          </div>
        </div>

        <div className="border-t border-gray-700 mb-5" />

        {/* DOB */}
        <div className="mb-5">
          <p className="text-gray-400 text-sm mb-1">Date of birth</p>
          <p className="text-white text-3xl font-bold">{mockUser.dob}</p>
        </div>

        {/* Class + Conditions grid */}
        <div className="flex border border-gray-700 rounded-sm mb-5 overflow-hidden">
          <div className="flex-1 bg-gray-900 px-4 py-3 border-r border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Class</p>
            <p className="text-white text-2xl font-bold">{mockUser.licenceClass}</p>
          </div>
          <div className="flex-1 bg-gray-900 px-4 py-3">
            <p className="text-gray-400 text-sm mb-1">Conditions</p>
            <p className="text-white text-2xl font-bold">{mockUser.conditions}</p>
          </div>
        </div>

        {/* Address — with ghost photo behind */}
        <div className="relative mb-5 overflow-hidden rounded-sm">
          <div className="absolute left-0 top-0 bottom-0 w-24 opacity-20">
            <img src={photoSrc} alt="" className="w-full h-full object-cover object-top" />
          </div>
          <div className="relative px-4 py-3">
            <p className="text-gray-400 text-sm mb-1">Address</p>
            <p className="text-white text-xl font-bold whitespace-pre-line leading-snug">
              {mockUser.address}
            </p>
          </div>
        </div>

        {/* Signature */}
        <div className="bg-white rounded-sm px-4 py-3 mb-6">
          <svg viewBox="0 0 300 60" className="w-full h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 40 Q35 15 50 38 Q60 52 70 35 Q78 22 88 38 Q95 48 100 35 Q108 18 118 40 Q125 52 135 38"
              stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"
            />
            <path
              d="M140 42 Q148 30 156 42 Q162 50 168 35"
              stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"
            />
          </svg>
        </div>

        {/* Yellow footer diagonal */}
        <div className="relative h-8 overflow-hidden mb-0 -mx-5">
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top right, #F0C020 50%, transparent 50%)',
            }}
          />
        </div>

        {/* Yellow section — card number */}
        <div className="bg-nsw-yellow -mx-5 px-5 py-5 flex items-center justify-between"
          style={{ backgroundColor: '#F0C020' }}>
          <div>
            <p className="text-gray-700 text-sm">Card number</p>
            <p className="text-black text-3xl font-bold tracking-wide">{mockUser.cardNumber}</p>
          </div>
          <div className="text-right">
            <NSWLotus size={44} color="#1a1a1a" />
            <p className="text-black text-sm font-bold tracking-widest mt-1">NSW</p>
          </div>
        </div>
      </div>

      {/* Sticky verify button */}
      <div className="sticky bottom-0 bg-black border-t border-gray-800 px-5 py-4">
        <button
          onMouseDown={handleVerifyStart}
          onMouseUp={handleVerifyEnd}
          onTouchStart={handleVerifyStart}
          onTouchEnd={handleVerifyEnd}
          className={`w-full py-4 rounded-xl font-bold tracking-widest text-sm transition-all duration-200 select-none ${
            verifying ? 'bg-green-600 text-white scale-95' : 'bg-gray-800 text-white'
          }`}
        >
          {verifying ? 'VERIFYING...' : 'HOLD TO VERIFY'}
        </button>
        <div className="flex justify-between mt-3">
          <button onClick={onLock} className="text-gray-500 text-xs">🔒 Lock</button>
          <p className="text-gray-600 text-xs">Hold for venue / age verification</p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
