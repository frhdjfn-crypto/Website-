import { CategoryDetail } from "@/components/category-detail"
import { notFound } from "next/navigation"
import { getBooksByCategory } from "@/lib/books-db"

export const revalidate = 60
import type { Metadata } from "next"

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = decodeURIComponent(slug)
  const books = await getBooksByCategory(category)
  const description = `تصفح كتب تصنيف ${category} واكتشف عناوين ومؤلفين جدد.`
  return {
    title: `كتب ${category}`,
    description,
    openGraph: { title: `كتب ${category}`, description, images: books[0]?.imageUrl ? [{ url: books[0].imageUrl, alt: `غلاف كتاب من تصنيف ${category}` }] : [] },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const categoryName = decodeURIComponent(slug)
  const books = await getBooksByCategory(categoryName)

  if (books.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryDetail categoryName={categoryName} books={books} />
    </div>
  )
}
