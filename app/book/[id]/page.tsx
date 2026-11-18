import { BookDetail } from "@/components/book-detail"
import { notFound } from "next/navigation"
import { getBookById } from "@/lib/books-data"

interface BookPageProps {
  params: {
    id: string
  }
}

export default function BookPage({ params }: BookPageProps) {
  const book = getBookById(Number.parseInt(params.id))

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
  // Generate static params for all books
  const bookIds = Array.from({ length: 28 }, (_, i) => ({ id: (i + 1).toString() }))
  return bookIds
}
