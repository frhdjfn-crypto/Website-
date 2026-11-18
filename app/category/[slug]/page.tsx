import { CategoryDetail } from "@/components/category-detail"
import { notFound } from "next/navigation"
import { getBooksByCategory, getCategories } from "@/lib/books-data"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = decodeURIComponent(params.slug)
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
  const categories = getCategories()
  return categories.map((category) => ({
    slug: encodeURIComponent(category),
  }))
}
