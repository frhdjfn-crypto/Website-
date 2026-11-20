import { BookList } from "@/components/book-list"
import { MostRatedBooks } from "@/components/most-rated-books"
import { MostDownloadedBooks } from "@/components/most-downloaded-books"
import { UserActions } from "@/components/user-actions"
import { HeroSection } from "@/components/hero-section"
import { FeaturedCategories } from "@/components/featured-categories"
import { NewestBooks } from "@/components/newest-books"
import { getSiteSettings } from "@/lib/site-settings"

export const metadata = { title: "الصفحة الرئيسية" }

export default async function Home() {
  const settings = await getSiteSettings()
  return (
    <div className="min-h-screen">
      <HeroSection title={settings.hero_title} subtitle={settings.hero_subtitle} />

      <div className="container mx-auto flex flex-col gap-12 px-4 py-8">
        <UserActions />
        <FeaturedCategories />
        {settings.show_newest && <NewestBooks />}
        {settings.show_most_downloaded && <MostDownloadedBooks />}
        {settings.show_random && <BookList />}
        {settings.show_most_rated && <MostRatedBooks />}
      </div>
    </div>
  )
}
