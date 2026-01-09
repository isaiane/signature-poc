'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useClientOnly } from '@/hooks/useClientOnly'

export default function SignaturePreviewPage() {
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null)
  const [originMethod, setOriginMethod] = useState<string | null>(null)
  const [isSvg, setIsSvg] = useState<boolean>(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const isClient = useClientOnly()

  // Função auxiliar para decodificar SVG e garantir fundo branco
  const decodeSvg = (dataUrl: string): string => {
    try {
      let svgContent: string
      
      if (dataUrl.includes('data:image/svg+xml')) {
        const base64 = dataUrl.split(',')[1]
        svgContent = atob(base64)
      } else {
        svgContent = dataUrl
      }
      
      // Garantir que o SVG tenha fundo branco
      if (svgContent.includes('<svg')) {
        // Adicionar ou modificar o background para branco
        svgContent = svgContent.replace(
          /<svg([^>]*)>/,
          '<svg$1 style="background-color: white;">'
        )
      }
      
      return svgContent
    } catch (error) {
      console.error('Erro ao decodificar SVG:', error)
      return dataUrl
    }
  }

  useEffect(() => {
    if (!isClient) return
    
    const saved = sessionStorage.getItem('finalSignatureImage')
    const method = sessionStorage.getItem('signatureMethod')
    if (!saved || !method) {
      router.replace(`/alternative?token=${token ?? ''}`)
    } else {
      setSignatureDataUrl(saved)
      setOriginMethod(method)
      
      // Detectar se é SVG (múltiplas formas de detecção)
      const isSvgFormat = 
        saved.includes('data:image/svg+xml') || 
        saved.includes('<svg') ||
        saved.startsWith('<svg') ||
        saved.includes('xmlns="http://www.w3.org/2000/svg"')
      setIsSvg(isSvgFormat)
    }
  }, [router, token, isClient])

  if (!isClient) return null
  if (!signatureDataUrl) return null

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <p className="text-lg mb-2 text-center">
        Esta é a versão final da sua assinatura, processada automaticamente. Deseja usá-la?
      </p>

      <div className="w-full max-w-xs border border-gray-300 rounded-lg overflow-hidden bg-white shadow mb-4 bg-red-500">
        {isSvg ? (
          // Renderizar SVG diretamente
          <div className="w-full h-48 flex items-center justify-center bg-white p-2">
            <div 
              className="w-full h-full flex items-center justify-center bg-white [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto"
              style={{ backgroundColor: 'white' }}
              dangerouslySetInnerHTML={{ 
                __html: decodeSvg(signatureDataUrl)
              }}
            />
          </div>
        ) : (
          // Renderizar imagem normal
          <div className="w-full h-48 flex items-center justify-center bg-white p-2">
            <Image
              src={signatureDataUrl}
              alt="Assinatura processada"
              width={400}
              height={200}
              className="max-w-full max-h-full w-auto h-auto object-contain"
              style={{ backgroundColor: 'white' }}
            />
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => router.push(`/mobile/alternative/${originMethod}?token=${token ?? ''}`)}
          className="px-4 py-2 bg-gray-200 rounded text-gray-700 text-sm"
        >
          Refazer
        </button>
        <button
          onClick={() => router.push(`/apply?token=${token ?? ''}`)}
          className="px-4 py-2 bg-black text-white rounded text-sm"
        >
          Confirmar
        </button>
      </div>
    </div>
  )
}