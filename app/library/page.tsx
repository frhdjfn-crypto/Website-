import { PersonalLibrary } from "@/components/personal-library"
import { getAllBooks } from "@/lib/books-db"

export const revalidate = 60

export default async function Library() {
  const books = await getAllBooks()
  return (
    <div className="container mx-auto px-4 py-8">
      <PersonalLibrary allBooks={books} />
    </div>
  )
}
