'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

type FacingMode = 'user' | 'environment'

interface UseSignatureCaptureProps {
  onCapture?: (dataUrl: string) => void
}

export function useSignatureCapture({ onCapture }: UseSignatureCaptureProps = {}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<FacingMode>('environment')
  const [error, setError] = useState<string | null>(null)
  const [isPortrait, setIsPortrait] = useState(true)

  // Detect portrait or landscape mode
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth)
    }
    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    return () => window.removeEventListener('resize', checkOrientation)
  }, [])

  // Initialize camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        // Parar stream anterior se existir
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }
        
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        })
        
        streamRef.current = mediaStream
        setStream(mediaStream)
        setError(null) // Limpar erro anterior
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        console.error('[useSignatureCapture] Camera Error:', err)
        setError('Failed to access camera.')
      }
    }

    startCamera()
    // Cleanup será feito no próximo useEffect quando stream mudar
  }, [facingMode]) // Removido 'stream' das dependências

  // Gerenciar o stream quando ele mudar
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  // Cleanup quando componente for desmontado
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
  }

  const handleCapture = useCallback(() => {
    if (!videoRef.current) return
    const video = videoRef.current
    
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const context = canvas.getContext('2d')
    if (!context) return
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/png')
    
    if (onCapture) {
      onCapture(dataUrl)
    }
  }, [onCapture])

  const captureImage = useCallback((moldureRect: DOMRect | null): string | null => {
    if (!videoRef.current || !moldureRect) {
      console.warn('[captureImage] videoRef or moldureRect is null')
      return null
    }
    
    const video = videoRef.current
    
    // Verificar se o vídeo está carregado
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn('[captureImage] Video not loaded yet, dimensions:', {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight
      })
      return null
    }

    const videoRect = video.getBoundingClientRect()
    // Usar dimensões do DOM diretamente (navegador)
    const canvasWidth = Math.round(moldureRect.width)
    const canvasHeight = Math.round(moldureRect.height)

    // Verificar se as dimensões são válidas
    if (canvasWidth <= 0 || canvasHeight <= 0) {
      console.error('[captureImage] Invalid dimensions:', { canvasWidth, canvasHeight })
      return null
    }

    const canvas = document.createElement('canvas')
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    const context = canvas.getContext('2d')
    if (!context) {
      console.warn('[captureImage] Failed to get canvas context')
      return null
    }

    // Calcular posição relativa no vídeo DOM
    const relativeX = moldureRect.left - videoRect.left
    const relativeY = moldureRect.top - videoRect.top

    // Verificar se a área está dentro dos limites do vídeo DOM
    if (relativeX < 0 || relativeY < 0 || 
        relativeX + canvasWidth > videoRect.width || 
        relativeY + canvasHeight > videoRect.height) {
      console.warn('[captureImage] Area outside video DOM bounds:', {
        relativeX, relativeY, canvasWidth, canvasHeight,
        videoRectWidth: videoRect.width,
        videoRectHeight: videoRect.height
      })
      return null
    }


    // Calcular o zoom aplicado pelo object-cover
    // object-cover mantém aspect ratio e preenche o container
    const videoAspectRatio = video.videoWidth / video.videoHeight
    const containerAspectRatio = videoRect.width / videoRect.height
    
    let zoomFactor = 1
    let offsetX = 0
    let offsetY = 0
    
    if (videoAspectRatio > containerAspectRatio) {
      // Vídeo é mais largo que o container - zoom horizontal
      zoomFactor = videoRect.height / video.videoHeight
      const scaledWidth = video.videoWidth * zoomFactor
      offsetX = (scaledWidth - videoRect.width) / 2
    } else {
      // Vídeo é mais alto que o container - zoom vertical
      zoomFactor = videoRect.width / video.videoWidth
      const scaledHeight = video.videoHeight * zoomFactor
      offsetY = (scaledHeight - videoRect.height) / 2
    }


    // Converter coordenadas DOM para coordenadas do vídeo real considerando o zoom
    const sourceX = (relativeX + offsetX) / zoomFactor
    const sourceY = (relativeY + offsetY) / zoomFactor
    const sourceWidth = canvasWidth / zoomFactor
    const sourceHeight = canvasHeight / zoomFactor


    // Verificar se as coordenadas estão dentro dos limites do vídeo real
    if (sourceX < 0 || sourceY < 0 || 
        sourceX + sourceWidth > video.videoWidth || 
        sourceY + sourceHeight > video.videoHeight) {
      console.warn('[captureImage] Source coordinates outside video bounds:', {
        sourceX, sourceY, sourceWidth, sourceHeight,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight
      })
      return null
    }

    // Desenhar a área específica do vídeo baseada nas coordenadas reais do vídeo
    context.drawImage(
      video,
      sourceX, sourceY, sourceWidth, sourceHeight,  // source rectangle (video coordinates)
      0, 0, canvasWidth, canvasHeight  // destination rectangle (canvas)
    )
    
    const dataUrl = canvas.toDataURL('image/png')
    return dataUrl
  }, [])

  // Função alternativa de captura baseada em DOM
  const captureImageAlternative = useCallback((moldureRect: DOMRect | null): string | null => {
    if (!videoRef.current || !moldureRect) {
      console.warn('[captureImageAlternative] videoRef or moldureRect is null')
      return null
    }
    
    const video = videoRef.current
    
    // Verificar se o vídeo está carregado
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn('[captureImageAlternative] Video not loaded yet')
      return null
    }

    const videoRect = video.getBoundingClientRect()
    


    // Usar dimensões do DOM para o canvas de captura
    const captureCanvas = document.createElement('canvas')
    captureCanvas.width = videoRect.width
    captureCanvas.height = videoRect.height
    
    const captureContext = captureCanvas.getContext('2d')
    if (!captureContext) {
      console.warn('[captureImageAlternative] Failed to get capture canvas context')
      return null
    }
    
    // Capturar o vídeo inteiro no canvas DOM (com zoom aplicado)
    captureContext.drawImage(video, 0, 0, videoRect.width, videoRect.height)
    
    // Calcular área de recorte baseada no DOM
    const cropX = moldureRect.left - videoRect.left
    const cropY = moldureRect.top - videoRect.top
    const cropWidth = moldureRect.width
    const cropHeight = moldureRect.height
    
    
    // Verificar se a área está dentro dos limites
    if (cropX < 0 || cropY < 0 || 
        cropX + cropWidth > videoRect.width || 
        cropY + cropHeight > videoRect.height) {
      console.warn('[captureImageAlternative] Crop area outside bounds')
      return null
    }
    
    // Criar canvas final com a área recortada
    const finalCanvas = document.createElement('canvas')
    finalCanvas.width = cropWidth
    finalCanvas.height = cropHeight
    
    const finalContext = finalCanvas.getContext('2d')
    if (!finalContext) {
      console.warn('[captureImageAlternative] Failed to get final canvas context')
      return null
    }
    
    // Desenhar a área recortada no canvas final
    finalContext.drawImage(captureCanvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)
    
    const dataUrl = finalCanvas.toDataURL('image/png')
    return dataUrl
  }, [])

  return {
    videoRef,
    isPortrait,
    error,
    facingMode,
    switchCamera,
    handleCapture,
    captureImage,
    captureImageAlternative,
  }
}