import { BookDetail } from "@/components/book-detail"
import { notFound } from "next/navigation"
import { getBookById } from "@/lib/books-db"

export const revalidate = 60
import type { Metadata } from "next"

interface BookPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { id } = await params
  const book = await getBookById(Number.parseInt(id, 10))
  if (!book) return { title: "الكتاب غير موجود" }
  const description = book.description?.slice(0, 160) || `اقرأ عن كتاب ${book.title} للمؤلف ${book.author}.`
  return {
    title: book.title,
    description,
    openGraph: { title: book.title, description, type: "book", images: book.imageUrl ? [{ url: book.imageUrl, alt: `غلاف ${book.title}` }] : [] },
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params
  const book = await getBookById(Number.parseInt(id, 10))

  if (!book) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BookDetail book={book} />
    </div>
  )
}
