import { TrendingBooks } from "@/components/trending-books"
import { getMostDownloadedBooks, getMostRatedBooks } from "@/lib/books-db"

export const revalidate = 60

export default async function TrendingPage() {
  const [mostDownloaded, highestRated] = await Promise.all([getMostDownloadedBooks(12), getMostRatedBooks(12)])

  return (
    <main className="container mx-auto px-4 py-8">
      <TrendingBooks mostDownloaded={mostDownloaded} highestRated={highestRated} />
    </main>
  )
}
