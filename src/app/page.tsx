"use client"

export default function Home() {
  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold">Assinatura Manuscrita</h1>
      <p className="mt-4">Início da PoC</p>
      <button
        className="mt-6 px-4 py-2 bg-black text-white rounded"
        onClick={() => alert("Interesse registrado!")}
      >
        Quero testar a assinatura
      </button>
    </main>
  )
}