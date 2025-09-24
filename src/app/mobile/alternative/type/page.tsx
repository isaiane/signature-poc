

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function TypeSignaturePage() {
  const [name, setName] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()
  const search = useSearchParams()

  useEffect(() => {
    const t = search.get('token')
    if (t) {
      setToken(t)
      console.log('[type] token:', t)
    }
  }, [search])

  const handleContinue = () => {
    console.log('[type] continuar com nome:', name)
    if (token) {
      router.push(`/mobile/preview?token=${token}`)
    }
  }

  return (
    <main className="flex flex-col items-center px-4 py-6 min-h-screen text-center">
      <h1 className="text-lg font-semibold mb-2">Digite sua assinatura</h1>
      <p className="text-sm text-gray-600 mb-4">Digite seu nome para simular a assinatura com uma fonte manuscrita.</p>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seu nome completo"
        className="border border-gray-300 px-4 py-2 rounded w-full max-w-xs text-center mb-4"
      />

      <div className="text-2xl font-signature text-black mb-4">
        {name}
      </div>

      <button
        onClick={handleContinue}
        disabled={!name}
        className={`px-6 py-2 rounded text-white ${name ? 'bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
      >
        Continuar
      </button>
    </main>
  )
}