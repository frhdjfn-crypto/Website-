import { BookList } from "@/components/book-list"
import { MostRatedBooks } from "@/components/most-rated-books"
import { MostDownloadedBooks } from "@/components/most-downloaded-books"
import { UserActions } from "@/components/user-actions"
import { HeroSection } from "@/components/hero-section"
import { FeaturedCategories } from "@/components/featured-categories"
import { NewestBooks } from "@/components/newest-books"

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      <div className="container mx-auto px-4 py-8 space-y-12">
        <UserActions />
        <FeaturedCategories />
        <div className="flex w-full flex-col gap-6">
          <NewestBooks />
          <MostDownloadedBooks />
        </div>
        <BookList />
        <MostRatedBooks />
      </div>
    </div>
  )
}
