'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import SignatureCamera from '@/components/SignatureCamera'

export default function CapturePage() {
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [name] = useState('Carlos Eduardo Gomes')

  const search = useSearchParams()
  const router = useRouter()
  const [sessionToken, setSessionToken] = useState<string | null>(null)

  useEffect(() => {
    const token = search.get('token')
    if (token) {
      setSessionToken(token)
      console.log('[capture] token:', token)
    }
  }, [search])

  const handleCapture = (dataUrl: string) => {
    if (dataUrl && sessionToken) {
      sessionStorage.setItem('signaturePhoto', dataUrl)
      router.push(`/mobile/preview?token=${sessionToken}`)
    }
  }

  return (
    <main className="flex flex-col items-center justify-between min-h-screen px-4 py-6 bg-gray-100 text-center">
      <p className="text-sm text-gray-700 mt-2 mb-4">
        Assine em um papel em branco ou use a assinatura do seu documento e enquadre na moldura e tire uma foto.
      </p>

      <div className="relative w-full max-w-md aspect-video rounded-md overflow-hidden border-4 border-white shadow-lg">
        <SignatureCamera
          facingMode={facingMode}
          onCapture={handleCapture}
        />
      </div>

      <div className="mt-4">
        <hr className="border-t border-gray-300 w-48 mx-auto mb-1" />
        <p className="text-sm text-gray-800">👤 {name}</p>
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
          className="text-gray-600"
        >
          🔄 Virar câmera
        </button>

        <button
          onClick={() => window.location.href = `/mobile/alternative?token=${sessionToken}`}
          className="underline text-sm text-gray-600"
        >
          Usar outro método de assinatura
        </button>
      </div>
    </main>
  )
}