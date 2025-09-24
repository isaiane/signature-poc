"use client"

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold">Assinatura Manuscrita</h1>
      <p className="mt-4">Início da PoC</p>
      <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => {
            console.log('clique_em_analisar_documentos') // futura telemetria
            router.push('/sign')
          }}
        >
          Analisar documentos
        </button>
    </main>
  )
}