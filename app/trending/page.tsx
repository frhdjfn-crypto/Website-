import { TrendingBooks } from "@/components/trending-books"
import { getAllBooks } from "@/lib/books-data"

export default function TrendingPage() {
  const books = getAllBooks()
  const mostDownloaded = [...books].sort((a, b) => (b.downloadCount ?? 0) - (a.downloadCount ?? 0)).slice(0, 12)
  const highestRated = [...books].sort((a, b) => b.rating - a.rating || (b.downloadCount ?? 0) - (a.downloadCount ?? 0)).slice(0, 12)

  return (
    <main className="container mx-auto px-4 py-8">
      <TrendingBooks mostDownloaded={mostDownloaded} highestRated={highestRated} />
    </main>
  )
}
