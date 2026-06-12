import { useState } from 'react'
import PinEntry from './components/PinEntry'
import IDCard from './components/IDCard'

export default function App() {
  const [unlocked, setUnlocked] = useState(false)
  return unlocked
    ? <IDCard onLock={() => setUnlocked(false)} />
    : <PinEntry onSuccess={() => setUnlocked(true)} />
}
