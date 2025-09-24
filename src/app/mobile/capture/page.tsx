'use client'

import { useState } from 'react'
import SignatureCamera from '@/components/SignatureCamera'

export default function CapturePage() {
  const [photo, setPhoto] = useState<string | null>(null)

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center">
      <h1 className="text-lg font-semibold mb-4">Capture sua assinatura</h1>

      {!photo ? (
        <SignatureCamera onCapture={(dataUrl) => setPhoto(dataUrl)} />
      ) : (
        <>
          <img
            src={photo}
            alt="Assinatura capturada"
            className="w-full max-w-md rounded shadow"
          />
          <button
            onClick={() => setPhoto(null)}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Refazer
          </button>
          <button
            onClick={() => console.log('[capture] continuar com imagem', photo)}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            Continuar
          </button>
        </>
      )}
    </main>
  )
}