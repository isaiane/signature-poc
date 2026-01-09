'use client'
import { Camera, Repeat } from 'lucide-react'

interface FooterActionsProps {
  onCapture: () => void
  onSwitchCamera: () => void
  onAlternative: () => void
}

export default function FooterActions({
  onCapture,
  onSwitchCamera,
  onAlternative
}: FooterActionsProps) {
  return (
    <div className="bottom-0 inset-x-0 z-40 flex justify-between items-center px-6 pb-8 pt-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
      <button
        onClick={onAlternative}
        className="text-white/90 text-xs underline"
      >
        Usar outro método de assinatura
      </button>

      <button
        onClick={onSwitchCamera}
        className="text-white/90"
      >
        <Repeat className="w-6 h-6" />
      </button>

      <button
        onClick={onCapture}
        className="bg-white text-black p-3 rounded-full shadow-md"
      >
        <Camera className="w-6 h-6" />
      </button>
    </div>
  )
}
