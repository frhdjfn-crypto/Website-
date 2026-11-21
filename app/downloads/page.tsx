import { DownloadsPage } from "@/components/downloads-page"
import { getAllBooks } from "@/lib/books-db"

export const revalidate = 60

export default async function Downloads() {
  const books = await getAllBooks()
  return (
    <div className="container mx-auto px-4 py-8">
      <DownloadsPage books={books} />
    </div>
  )
}
