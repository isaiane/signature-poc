'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function FallbackPage() {
  const search = useSearchParams()
  const router = useRouter()
  const token = search.get('token')

  useEffect(() => {
    // Limpa imagem em caso de falha anterior
    sessionStorage.removeItem('finalSignatureImage')
    sessionStorage.removeItem('signatureMethod')
  }, [])

  const handleRetry = () => {
    router.push(`/mobile/alternative?token=${token}`)
  }

  return (
    <main className="min-h-screen flex items-center justify-center flex-col bg-white text-gray-800">
      <div className="text-center px-6">
        <h2 className="text-lg font-semibold mb-2">Não conseguimos processar sua assinatura</h2>
        <p className="text-sm text-gray-600 mb-4">
          Pode ter ocorrido um erro técnico. Você pode tentar novamente ou escolher outro método de assinatura.
        </p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Voltar para escolher método
        </button>
      </div>
    </main>
  )
}