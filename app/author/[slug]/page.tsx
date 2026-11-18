import { AuthorDetail } from "@/components/author-detail"
import { notFound } from "next/navigation"
import { getBooksByAuthor, getAuthors } from "@/lib/books-data"

interface AuthorPageProps {
  params: {
    slug: string
  }
}

export default function AuthorPage({ params }: AuthorPageProps) {
  const authorName = decodeURIComponent(params.slug)
  const books = getBooksByAuthor(authorName)

  if (books.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AuthorDetail authorName={authorName} books={books} />
    </div>
  )
}

export async function generateStaticParams() {
  const authors = getAuthors()
  return authors.map((author) => ({
    slug: encodeURIComponent(author),
  }))
}
