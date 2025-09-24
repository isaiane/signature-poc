'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PoucoPage() {
  const search = useSearchParams()
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const tokenFromUrl = search.get('token')
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    }
  }, [search])

  if (!token) return null

  const handleContinue = () => {
    router.push(`/mobile/capture?token=${token}`)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 className="text-xl font-semibold mb-4">Continue sua assinatura</h1>
      <p className="text-gray-700 mb-6 max-w-md">
        Agora vamos seguir com as próximas etapas pelo seu celular.
        O processo é simples, rápido e seguro.
      </p>
      <button
        onClick={handleContinue}
        className="bg-[#5D0026] text-white px-8 py-3 rounded-full text-lg"
      >
        Continuar
      </button>
      <p className="text-xs text-gray-500 mt-6">
        <span className="inline-block mr-1">🛡️</span>
        Ambiente seguro <span className="text-orange-500 font-medium">SmartSign</span>
      </p>
    </main>
  )
}