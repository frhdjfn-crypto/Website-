import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getBookById } from "@/lib/books-db"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const bookId = Number(id)
  if (!Number.isSafeInteger(bookId) || bookId < 1) return NextResponse.json({ error: "unavailable" }, { status: 404 })

  const book = await getBookById(bookId)
  if (!book?.downloadUrl?.trim()) return NextResponse.json({ error: "unavailable" }, { status: 404 })

  let downloadUrl: URL
  try {
    downloadUrl = new URL(book.downloadUrl, _request.nextUrl.origin)
    if (!['http:', 'https:'].includes(downloadUrl.protocol)) throw new Error("Invalid URL")
    const head = await fetch(downloadUrl, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(8000) })
    if (!head.ok) return NextResponse.json({ error: "unavailable" }, { status: 404 })
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 404 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { error: insertError } = await supabase.from("downloads").insert({ book_id: bookId, user_id: user?.id ?? null })
  if (insertError) return NextResponse.json({ error: "network" }, { status: 503 })
  const { error: incrementError } = await supabase.rpc("increment_download", { p_book_id: bookId })
  if (incrementError) return NextResponse.json({ error: "network" }, { status: 503 })

  return NextResponse.redirect(downloadUrl)
}
