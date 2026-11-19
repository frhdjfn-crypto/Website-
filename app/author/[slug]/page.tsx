import { AuthorDetail } from "@/components/author-detail"
import { notFound } from "next/navigation"
import { getBooksByAuthor, getAuthors } from "@/lib/books-data"

interface AuthorPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params
  const authorName = decodeURIComponent(slug)
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
  return getAuthors().map((author) => ({
    slug: encodeURIComponent(author),
  }))
}
