import { useState, useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { mockUser } from '../data/mockUser'

function usePhoto() {
  const [photo, setPhoto] = useState(() => localStorage.getItem('id_photo') || null)
  const upload = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      localStorage.setItem('id_photo', e.target.result)
      setPhoto(e.target.result)
    }
    reader.readAsDataURL(file)
  }
  return [photo, upload]
}

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
  const [photo, uploadPhoto] = usePhoto()
  const fileInputRef = useRef(null)
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
            <div
              className="relative overflow-hidden cursor-pointer"
              style={{ width: 200, height: 250, borderRadius: 4 }}
              onClick={() => fileInputRef.current?.click()}
            >
              {photo ? (
                <img src={photo} alt="ID Photo" className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ background: '#1a1a1a', border: '2px dashed rgba(255,255,255,0.15)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="text-xs font-medium text-center" style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                    Tap to upload<br/>your photo
                  </span>
                </div>
              )}
              <HolographicOverlay />
              {photo && (
                <div
                  className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full"
                  style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
                  </svg>
                  <span className="text-white text-xs">Change</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])}
            />
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
            {photo && (
              <div className="absolute left-0 top-0 bottom-0" style={{ width: 80, opacity: 0.15 }}>
                <img src={photo} alt="" className="w-full h-full object-cover object-top" />
              </div>
            )}
            <div className="relative px-4 py-4">
              <p className="text-gray-500 text-xs font-medium tracking-wider uppercase mb-1">Address</p>
              <p className="text-white font-bold text-xl leading-snug whitespace-pre-line">
                {mockUser.address}
              </p>
            </div>
          </div>

          {/* Signature */}
          <div className="mb-2" style={{ background: 'white', borderRadius: 4, padding: '12px 16px' }}>
            <svg viewBox="0 0 280 55" className="w-full" style={{ height: 44 }} fill="none">
              <path
                d="M16 36 C22 20, 30 14, 38 30 C42 38, 46 44, 52 32 C56 24, 60 18, 66 30 C70 38, 73 44, 80 30 C85 20, 90 16, 98 34 C102 42, 106 46, 113 32 C118 22, 124 18, 130 36"
                stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"
              />
              <path
                d="M136 38 C140 28, 146 24, 152 36 C156 44, 160 46, 165 34 C168 26, 172 24, 176 32"
                stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"
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
