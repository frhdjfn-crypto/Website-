import { BookDetail } from "@/components/book-detail"
import { notFound } from "next/navigation"
import { getAllBooks, getBookById } from "@/lib/books-data"

interface BookPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params
  const book = getBookById(Number.parseInt(id, 10))

  if (!book) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BookDetail book={book} />
    </div>
  )
}

export async function generateStaticParams() {
  return getAllBooks().map((book) => ({ id: book.id.toString() }))
}
