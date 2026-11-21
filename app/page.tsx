import { BookList } from "@/components/book-list"
import { MostRatedBooks } from "@/components/most-rated-books"
import { MostDownloadedBooks } from "@/components/most-downloaded-books"
import { UserActions } from "@/components/user-actions"
import { HeroSection } from "@/components/hero-section"
import { FeaturedCategories } from "@/components/featured-categories"
import { NewestBooks } from "@/components/newest-books"
import { getSiteSettings } from "@/lib/site-settings"
import { getAllBooks, getNewestBooks, getMostDownloadedBooks, getMostRatedBooks, getCategories, getLibraryStats } from "@/lib/books-db"

export const revalidate = 60

export const metadata = { title: "الصفحة الرئيسية" }

export default async function Home() {
  const [settings, allBooks, newestBooks, downloadedBooks, ratedBooks, categoryNames, stats] = await Promise.all([
    getSiteSettings(), getAllBooks(), getNewestBooks(10), getMostDownloadedBooks(10), getMostRatedBooks(5), getCategories(), getLibraryStats(),
  ])
  const featuredCategories = categoryNames.map((name) => {
    const matches = allBooks.filter((book) => book.category === name)
    return { name, count: matches.length, averageRating: matches.length ? matches.reduce((sum, book) => sum + book.rating, 0) / matches.length : 0 }
  })
  return (
    <div className="min-h-screen">
      <HeroSection title={settings.hero_title} subtitle={settings.hero_subtitle} stats={stats} />

      <div className="container mx-auto flex flex-col gap-12 px-4 py-8">
        <UserActions />
        <FeaturedCategories categories={featuredCategories} />
        {settings.show_newest && <NewestBooks initialBooks={newestBooks} />}
        {settings.show_most_downloaded && <MostDownloadedBooks books={downloadedBooks} />}
        {settings.show_random && <BookList initialBooks={allBooks} />}
        {settings.show_most_rated && <MostRatedBooks books={ratedBooks} />}
      </div>
    </div>
  )
}
