

'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const options = [
  {
    id: 'capture',
    label: 'Usar a câmera do celular',
    description: 'Pegue um papel, assine e tire uma foto. Nós cuidamos do resto!',
    recommended: true,
  },
  {
    id: 'upload',
    label: 'Anexar assinatura',
    description: 'Anexe uma imagem da sua assinatura.',
  },
  {
    id: 'draw',
    label: 'Assinar na tela',
    description: 'Use o dedo ou uma caneta para assinar diretamente na tela.',
  },
  {
    id: 'type',
    label: 'Digitar',
    description: 'Digite seu nome completo e nós transformamos em uma assinatura.',
  },
]

export default function AlternativePage() {
  const [selected, setSelected] = useState<string | null>(null)
  const router = useRouter()
  const search = useSearchParams()
  const token = search.get('token')

  const handleContinue = () => {
    if (!selected) return
    if (token) {
      router.push(`/mobile/alternative/${selected}?token=${token}`)
    } else {
      router.push(`/mobile/alternative/${selected}`)
    }
  }

  return (
    <main className="min-h-screen flex flex-col justify-between px-4 py-6 bg-white">
      <div>
        <h2 className="text-center text-lg font-semibold text-gray-800 mb-1">Crie sua assinatura</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Selecione uma das opções abaixo para criar sua assinatura.
        </p>

        <div className="flex flex-col gap-4">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`w-full text-left px-4 py-3 rounded border ${
                selected === opt.id ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                  <p className="text-xs text-gray-600">{opt.description}</p>
                  {opt.recommended && (
                    <span className="text-green-700 text-xs mt-1 inline-block">✅ Recomendado</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected}
        className={`mt-8 w-full py-3 rounded-full text-white text-sm font-medium ${
          selected ? 'bg-[#5D0026]' : 'bg-gray-300'
        }`}
      >
        Continuar
      </button>
    </main>
  )
}