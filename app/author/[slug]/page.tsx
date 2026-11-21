import { AuthorDetail } from "@/components/author-detail"
import { notFound } from "next/navigation"
import { getBooksByAuthor } from "@/lib/books-db"

export const revalidate = 60
import type { Metadata } from "next"

interface AuthorPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params
  const author = decodeURIComponent(slug)
  const books = await getBooksByAuthor(author)
  const description = `اكتشف كتب ومؤلفات ${author} المتاحة في زيتونة بوك.`
  return {
    title: `كتب ${author}`,
    description,
    openGraph: { title: `كتب ${author}`, description, images: books[0]?.imageUrl ? [{ url: books[0].imageUrl, alt: `كتاب للمؤلف ${author}` }] : [] },
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params
  const authorName = decodeURIComponent(slug)
  const books = await getBooksByAuthor(authorName)

  if (books.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AuthorDetail authorName={authorName} books={books} />
    </div>
  )
}
