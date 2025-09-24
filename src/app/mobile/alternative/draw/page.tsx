

'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function DrawSignaturePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()
  const search = useSearchParams()

  useEffect(() => {
    const t = search.get('token')
    if (t) {
      setToken(t)
      console.log('[draw] token:', t)
    }
  }, [search])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let drawing = false

    const start = (e: TouchEvent | MouseEvent) => {
      drawing = true
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY
      const rect = canvas.getBoundingClientRect()
      ctx.beginPath()
      ctx.moveTo(x - rect.left, y - rect.top)
    }

    const draw = (e: TouchEvent | MouseEvent) => {
      if (!drawing) return
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY
      const rect = canvas.getBoundingClientRect()
      ctx.lineTo(x - rect.left, y - rect.top)
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.stroke()
    }

    const stop = () => {
      drawing = false
    }

    canvas.addEventListener('mousedown', start)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stop)
    canvas.addEventListener('mouseleave', stop)

    canvas.addEventListener('touchstart', start)
    canvas.addEventListener('touchmove', draw)
    canvas.addEventListener('touchend', stop)

    return () => {
      canvas.removeEventListener('mousedown', start)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', stop)
      canvas.removeEventListener('mouseleave', stop)
      canvas.removeEventListener('touchstart', start)
      canvas.removeEventListener('touchmove', draw)
      canvas.removeEventListener('touchend', stop)
    }
  }, [])

  const handleClear = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  const handleContinue = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const data = canvas.toDataURL('image/png')
      console.log('[draw] continuar com imagem', data)
      if (token) {
        router.push(`/mobile/preview?token=${token}`)
      }
    }
  }

  return (
    <main className="flex flex-col items-center px-4 py-6 min-h-screen text-center">
      <h1 className="text-lg font-semibold mb-2">Assine na tela</h1>
      <p className="text-sm text-gray-600 mb-4">Use o dedo ou uma caneta para desenhar sua assinatura abaixo.</p>

      <canvas
        ref={canvasRef}
        width={300}
        height={120}
        className="border border-gray-300 bg-white rounded mb-4 touch-none"
      />

      <div className="flex gap-4">
        <button onClick={handleClear} className="bg-gray-500 text-white px-4 py-2 rounded">
          Refazer
        </button>
        <button onClick={handleContinue} className="bg-green-600 text-white px-6 py-2 rounded">
          Continuar
        </button>
      </div>
    </main>
  )
}