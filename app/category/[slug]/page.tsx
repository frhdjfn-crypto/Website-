import { CategoryDetail } from "@/components/category-detail"
import { notFound } from "next/navigation"
import { getBooksByCategory, getCategories } from "@/lib/books-data"

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const categoryName = decodeURIComponent(slug)
  const books = getBooksByCategory(categoryName)

  if (books.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryDetail categoryName={categoryName} books={books} />
    </div>
  )
}

export async function generateStaticParams() {
  return getCategories().map((category) => ({
    slug: encodeURIComponent(category),
  }))
}
