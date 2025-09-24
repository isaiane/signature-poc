

'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'

export default function UploadSignaturePage() {
  const [image, setImage] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const search = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const t = search.get('token')
    if (t) {
      setToken(t)
      console.log('[upload] token:', t)
    }
  }, [search])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result as string)
      console.log('[upload] image loaded')
    }
    reader.readAsDataURL(file)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-6 text-center">
      <h1 className="text-lg font-semibold mb-4">Anexe sua assinatura</h1>
      <p className="text-sm text-gray-600 mb-4">
        Envie uma imagem da sua assinatura manuscrita em papel.
      </p>

      {!image ? (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="mb-4"
          />
        </>
      ) : (
        <>
          <Image
            src={image}
            alt="preview"
            className="w-full max-w-xs rounded shadow mb-4"
          />
          <button
            onClick={() => setImage(null)}
            className="mb-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Refazer
          </button>
          <button
            onClick={() => {
              console.log('[upload] continuar com imagem', image)
              if (token) {
                router.push(`/mobile/preview?token=${token}`)
              }
            }}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Continuar
          </button>
        </>
      )}
    </main>
  )
}