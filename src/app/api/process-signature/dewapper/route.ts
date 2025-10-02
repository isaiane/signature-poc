// app/api/dewapper/route.ts
import { NextResponse } from "next/server"
import { dewapper } from "@/lib/image_process/dewapper"

export async function handleDewapper(file: File | Blob) {
  const buffer = Buffer.from(await file.arrayBuffer())

  const processed = await dewapper(buffer)

  return new NextResponse(processed, {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Disposition": "inline; filename=dewappered.jpg",
    },
  })
}

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 })
  }

  try {
    return await handleDewapper(file)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}