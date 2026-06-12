import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { mockUser } from '../data/mockUser'

const photoSrc = '/photo.jpg'

/* NSW Waratah — stylised Telopea flower matching the real NSW Government logo */
function NSWWaratah({ size = 48, color = '#E8192C' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer petals — 8 rounded petals radiating from centre */}
      {[0,45,90,135,180,225,270,315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const cx = 50 + Math.sin(rad) * 28
        const cy = 50 - Math.cos(rad) * 28
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx="10"
            ry="16"
            transform={`rotate(${angle}, ${cx}, ${cy})`}
            fill={color}
            opacity="0.9"
          />
        )
      })}
      {/* Inner ring of petals */}
      {[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const cx = 50 + Math.sin(rad) * 16
        const cy = 50 - Math.cos(rad) * 16
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx="7"
            ry="11"
            transform={`rotate(${angle}, ${cx}, ${cy})`}
            fill={color}
          />
        )
      })}
      {/* Centre dome */}
      <circle cx="50" cy="50" r="13" fill={color} />
      <circle cx="50" cy="50" r="8" fill={color === '#E8192C' ? '#c0001f' : color} opacity="0.6" />
      {/* Tiny stamen dots */}
      {[0,60,120,180,240,300].map((a, i) => {
        const r = (a * Math.PI) / 180
        return <circle key={i} cx={50 + Math.sin(r) * 5} cy={50 - Math.cos(r) * 5} r="1.5" fill="white" opacity="0.8" />
      })}
    </svg>
  )
}

function RefreshedTime() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])
  const day = now.getDate()
  const month = now.toLocaleString('en-AU', { month: 'short' })
  const year = now.getFullYear()
  const time = now.toLocaleString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()
  return (
    <div className="text-right leading-snug">
      <p className="text-gray-500 text-xs font-medium tracking-wide">Refreshed</p>
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
        background: [
          'conic-gradient(from 0deg at 40% 55%,',
          '#ff006855, #ff7c0055, #ffe60055,',
          '#00ff8855, #00b8ff55, #8000ff55,',
          '#ff006855)',
        ].join(' '),
        mixBlendMode: 'color',
        animation: 'holo-spin 10s linear infinite',
      }}
    />
  )
}

function Divider() {
  return <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 0 20px' }} />
}

function Field({ label, value, large = false, className = '' }) {
  return (
    <div className={className}>
      <p className="text-gray-500 text-xs font-medium tracking-wider uppercase mb-0.5">{label}</p>
      <p className={`text-white font-bold leading-tight ${large ? 'text-3xl' : 'text-2xl'}`}>{value}</p>
    </div>
  )
}

export default function IDCard({ onLock }) {
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [progress, setProgress] = useState(0)
  const [verifyTimer, setVerifyTimer] = useState(null)
  const [progressInterval, setProgressInterval] = useState(null)

  const handleVerifyStart = () => {
    setVerifying(true)
    setProgress(0)
    const iv = setInterval(() => setProgress(p => Math.min(p + 4, 100)), 60)
    setProgressInterval(iv)
    const t = setTimeout(() => {
      clearInterval(iv)
      setProgress(100)
      setVerified(true)
      setTimeout(() => { setVerified(false); setVerifying(false); setProgress(0) }, 2500)
    }, 1500)
    setVerifyTimer(t)
  }

  const handleVerifyEnd = () => {
    if (!verified) {
      clearTimeout(verifyTimer)
      clearInterval(progressInterval)
      setVerifying(false)
      setProgress(0)
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
    <div className="min-h-screen flex flex-col" style={{ background: '#0d0d0d', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* Verified full-screen overlay */}
      {verified && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50" style={{ background: '#1a8a3a' }}>
          <div className="mb-6">
            <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="46" stroke="white" strokeWidth="4" opacity="0.3" />
              <circle cx="50" cy="50" r="46" stroke="white" strokeWidth="4"
                strokeDasharray="289" strokeDashoffset="0"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
              <path d="M28 52 L44 68 L72 36" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <p className="text-white text-4xl font-black tracking-widest mb-2">VERIFIED</p>
          <p className="text-green-200 text-base font-medium">Identity Confirmed</p>
        </div>
      )}

      {/* Top yellow wedge — exactly like real app */}
      <div className="flex-shrink-0 relative overflow-hidden" style={{ height: 56 }}>
        <svg viewBox="0 0 390 56" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <polygon points="0,0 390,0 260,56 0,56" fill="#F2C015" />
        </svg>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 100 }}>
        <div className="px-6 pt-5 pb-2">

          {/* Header row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <NSWWaratah size={42} color="#E8192C" />
              <span className="text-white font-black text-xl tracking-[0.18em]">NSW</span>
            </div>
            <RefreshedTime />
          </div>

          {/* Photo */}
          <div className="flex justify-center mb-5">
            <div className="relative overflow-hidden" style={{ width: 200, height: 250, borderRadius: 4 }}>
              <img src={photoSrc} alt="ID Photo" className="w-full h-full object-cover object-top" />
              <HolographicOverlay />
            </div>
          </div>

          {/* Name */}
          <h1 className="text-white text-center font-black mb-6" style={{ fontSize: 26, letterSpacing: '0.01em' }}>
            {mockUser.firstName} {mockUser.lastName}
          </h1>

          <Divider />

          {/* Licence + QR */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 pr-4">
              <Field label="Licence number" value={mockUser.licenceNumber} large />
              <div className="mt-5">
                <Field label="Expiry" value={mockUser.expiry} large />
              </div>
            </div>
            <div className="flex-shrink-0" style={{ background: 'white', padding: 6, borderRadius: 4 }}>
              <QRCodeSVG value={qrData} size={112} level="M" />
            </div>
          </div>

          <Divider />

          {/* DOB */}
          <div className="mb-6">
            <Field label="Date of birth" value={mockUser.dob} large />
          </div>

          {/* Class + Conditions */}
          <div className="flex mb-6 overflow-hidden" style={{ borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex-1 px-4 py-3" style={{ borderRight: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}>
              <Field label="Class" value={mockUser.licenceClass} />
            </div>
            <div className="flex-1 px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <Field label="Conditions" value={mockUser.conditions} />
            </div>
          </div>

          {/* Address with ghost photo */}
          <div className="relative mb-6 overflow-hidden" style={{ borderRadius: 6 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.03)' }} />
            <div className="absolute left-0 top-0 bottom-0" style={{ width: 80, opacity: 0.15 }}>
              <img src={photoSrc} alt="" className="w-full h-full object-cover object-top" />
            </div>
            <div className="relative px-4 py-4">
              <p className="text-gray-500 text-xs font-medium tracking-wider uppercase mb-1">Address</p>
              <p className="text-white font-bold text-xl leading-snug whitespace-pre-line">
                {mockUser.address}
              </p>
            </div>
          </div>

          {/* Signature */}
          <div className="mb-2" style={{ background: 'white', borderRadius: 4, padding: '14px 20px' }}>
            <svg viewBox="0 0 260 64" className="w-full" style={{ height: 52 }} fill="none">
              {/* h — tall ascender with looped hump */}
              <path
                d="M12 52 C12 40 13 22 15 14 C16 10 17 9 18 10 C19 12 18 22 18 32 C18 36 19 38 21 36 C25 31 30 26 35 28 C39 30 40 36 40 42 C40 46 40 50 41 52"
                stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"
              />
              {/* l — tall looping ascender connected */}
              <path
                d="M41 52 C41 44 42 28 44 18 C45 13 46 11 47 12 C48 14 48 24 48 36 C48 44 48 50 49 53"
                stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"
              />
              {/* e — cursive, connected from l */}
              <path
                d="M49 53 C51 50 55 44 60 43 C64 42 67 44 68 47 C69 51 67 55 63 56 C59 57 55 54 54 51 C53 48 55 44 59 43"
                stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"
              />
              {/* e — second e with exit flourish */}
              <path
                d="M68 47 C70 44 74 42 79 43 C83 44 85 47 85 50 C85 54 82 57 78 57 C74 57 70 54 70 51 C69 48 71 44 75 43 C78 42 82 44 84 47 C86 50 88 52 96 51 C104 50 112 47 120 46"
                stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"
              />
              {/* Underline flourish */}
              <path
                d="M10 58 C30 60 70 62 120 59"
                stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5"
              />
            </svg>
          </div>
        </div>

        {/* Yellow footer wedge */}
        <div className="relative overflow-hidden" style={{ height: 40 }}>
          <svg viewBox="0 0 390 40" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            <polygon points="0,40 390,40 390,10 130,40" fill="#F2C015" />
          </svg>
        </div>

        {/* Yellow footer */}
        <div className="flex items-center justify-between px-6 py-5" style={{ background: '#F2C015' }}>
          <div>
            <p className="text-yellow-900 text-xs font-medium tracking-wider uppercase mb-0.5">Card number</p>
            <p className="text-black font-black text-3xl tracking-wide">{mockUser.cardNumber}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <NSWWaratah size={42} color="#1a1a1a" />
            <span className="text-black font-black text-sm tracking-[0.2em]">NSW</span>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 py-4"
        style={{ background: 'rgba(13,13,13,0.97)', borderTop: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)' }}
      >
        <button
          onMouseDown={handleVerifyStart}
          onMouseUp={handleVerifyEnd}
          onTouchStart={handleVerifyStart}
          onTouchEnd={handleVerifyEnd}
          className="w-full relative overflow-hidden select-none"
          style={{
            height: 52,
            borderRadius: 12,
            background: verifying ? '#1a8a3a' : '#1e1e1e',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '0.12em',
            transition: 'background 0.2s',
          }}
        >
          {verifying && (
            <div
              className="absolute left-0 top-0 bottom-0 transition-all duration-75"
              style={{ width: `${progress}%`, background: 'rgba(255,255,255,0.15)', borderRadius: 12 }}
            />
          )}
          <span className="relative">{verifying ? 'VERIFYING...' : 'HOLD TO VERIFY'}</span>
        </button>
        <div className="flex items-center justify-between mt-2.5 px-1">
          <button onClick={onLock} className="text-xs font-medium" style={{ color: '#555' }}>Lock</button>
          <p className="text-xs" style={{ color: '#444' }}>Hold for venue / age verification</p>
        </div>
      </div>

      <style>{`
        @keyframes holo-spin {
          from { transform: rotate(0deg) scale(1.4); }
          to   { transform: rotate(360deg) scale(1.4); }
        }
      `}</style>
    </div>
  )
}
