'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface SignatureProcessingProps {
  dataUrl: string
  step: string
}

export default function SignatureProcessing({ dataUrl, step }: SignatureProcessingProps) {
  const router = useRouter()
  const search = useSearchParams()
  const token = search.get('token')

  useEffect(() => {
    const process = async () => {
      try {
        console.log('[SignatureProcessing] Iniciando processamento...')
        const blob = await (await fetch(dataUrl)).blob()
        const file = new File([blob], 'signature.jpg', { type: blob.type })

        const form = new FormData()
        form.append('file', file)
        form.append('steps', step)

        const res = await fetch('/api/process-signature', {
          method: 'POST',
          body: form,
        })

        if (!res.ok) throw new Error(`Erro ao processar imagem. Status: ${res.status}`)

        const resultBlob = await res.blob()
        const reader = new FileReader()
        reader.onloadend = () => {
          // Detectar o tipo correto baseado no Content-Type da resposta
          const contentType = res.headers.get('content-type') || 'image/jpeg'
          const dataUrl = reader.result as string
          
          // Se for SVG, converter para data:image/svg+xml
          if (contentType.includes('svg')) {
            const svgData = dataUrl.split(',')[1]
            const svgString = atob(svgData)
            const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`
            sessionStorage.setItem('finalSignatureImage', svgDataUrl)
          } else {
            sessionStorage.setItem('finalSignatureImage', dataUrl)
          }
          
          sessionStorage.setItem('signatureMethod', 'capture')
          router.push(`/mobile/preview?token=${token}`)
        }
        reader.readAsDataURL(resultBlob)
      } catch (err) {
        console.error('[SignatureProcessing] Erro no processamento:', err)
        router.push(`/mobile/fallback?token=${token}`)
      }
    }

    process()
  }, [dataUrl, step, token, router])

  return (
    <main className="min-h-screen flex items-center justify-center flex-col bg-white text-gray-800">
      <div className="text-center px-6">
        <h2 className="text-lg font-semibold mb-2">Processando sua assinatura...</h2>
        <p className="text-sm text-gray-600">Aguarde alguns segundos.</p>
      </div>
    </main>
  )
}