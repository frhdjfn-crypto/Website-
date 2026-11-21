import { AuthorsPage } from "@/components/authors-page"
import { getAuthors, getAllBooks, getLibraryStats } from "@/lib/books-db"

export const revalidate = 60

export default async function Authors() {
  const [authors, books, stats] = await Promise.all([getAuthors(), getAllBooks(), getLibraryStats()])
  return (
    <div className="container mx-auto px-4 py-8">
      <AuthorsPage authorNames={authors} allBooks={books} stats={stats} />
    </div>
  )
}
