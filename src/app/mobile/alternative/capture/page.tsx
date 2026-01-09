'use client'

import { useRef, useEffect, useState } from 'react'
import CameraFeed from '@/components/capture/camera-feed'
import OverlayGuide, { OverlayGuideHandle } from '@/components/capture/overlay-guide'
import HeaderInstructions from '@/components/capture/header-instructions'
import FooterActions from '@/components/capture/footer-actions'
import { useSignatureCapture } from '@/hooks/useSignatureCapture'
import { useSearchParams } from 'next/navigation'
import SignatureProcessing from '@/components/signature-processing'
import { User } from 'lucide-react'

export default function CaptureSignaturePage() {
  const search = useSearchParams()
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [name] = useState('Carlos Eduardo Gomes')
  const [processingDataUrl, setProcessingDataUrl] = useState<string | null>(null)

  // refs
  const overlayRef = useRef<OverlayGuideHandle | null>(null)

  // hook provides videoRef and captureImage utility
  const {
    videoRef,
    facingMode,
    switchCamera,
    captureImage,
  } = useSignatureCapture()

  useEffect(() => {
    const token = search.get('token')
    if (token) {
      setSessionToken(token)
      console.log('[capture] token:', token)
    }
  }, [search])

  // local capture handler: get overlay rect, capture only that area
  const handleCapture = async () => {
    try {
      // Aguardar um pouco para garantir que o vídeo esteja carregado
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const rect = overlayRef.current?.getRect() ?? null
      if (!rect) {
        console.error('[capture] overlay rect is null')
        return
      }
      
      
      // Verificar se o vídeo está pronto
      if (!videoRef.current || videoRef.current.videoWidth === 0) {
        console.error('[capture] Video not ready yet')
        return
      }
      
      // Capturar usando dimensões DOM
      const dataUrl = captureImage(rect)
      if (!dataUrl) {
        console.error('[capture] DOM-based capture failed')
        return
      }
      
      // trigger processing step
      setProcessingDataUrl(dataUrl)
    } catch (err) {
      console.error('[capture] handleCapture error', err)
    }
  }

  if (processingDataUrl && sessionToken) {
    return (
      <SignatureProcessing
        dataUrl={processingDataUrl}
        step="dewapper,signature-extractor,unsharpen,color-correlation,remove-background,vectorize"
      />
    )
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* camera below */}
      <CameraFeed ref={videoRef} facingMode={facingMode} />

      {/* overlay + UI above camera */}
      <div className="absolute inset-0 flex flex-col justify-between z-20 h-full">
        <HeaderInstructions />

        <div className="flex flex-col items-center">
          <OverlayGuide ref={overlayRef} />
          <div className="z-20 mt-2 flex items-center gap-2 text-white text-sm font-medium pointer-events-none border-t-2 border-white w-full max-w-[90%] flex flex-row justify-center">
            <User className="h-4 w-4 text-white opacity-70" />
            {name}
          </div>
        </div>

        <FooterActions
          onCapture={handleCapture}
          onSwitchCamera={switchCamera}
          onAlternative={() =>
            sessionToken && (window.location.href = `/mobile/alternative?token=${sessionToken}`)
          }
        />
      </div>

    </main>
  )
}