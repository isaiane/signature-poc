'use client'

import { useEffect, useRef, useState } from 'react'

interface SignatureCameraProps {
  onCapture: (imageDataUrl: string) => void
  facingMode: 'environment' | 'user'
}

export default function SignatureCamera({ onCapture, facingMode }: SignatureCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error('[camera] error accessing camera', err)
        setError('Erro ao acessar a câmera. Verifique permissões.')
      }
    }

    startCamera()
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [facingMode])

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    const video = videoRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/png')
      console.log('[camera] image captured')
      onCapture(dataUrl)
    }
  }

  return (
    <div className="flex flex-col items-center">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-md rounded shadow"
      />
      <button
        onClick={handleCapture}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
      >
        Capturar
      </button>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}