import { CategoriesPage } from "@/components/categories-page"
import { getCategories, getAllBooks, getLibraryStats } from "@/lib/books-db"

export const revalidate = 60

export default async function Categories() {
  const [categories, books, stats] = await Promise.all([getCategories(), getAllBooks(), getLibraryStats()])
  return (
    <div className="container mx-auto px-4 py-8">
      <CategoriesPage categoryNames={categories} allBooks={books} stats={stats} />
    </div>
  )
}
