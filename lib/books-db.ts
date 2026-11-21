import { createClient } from "@supabase/supabase-js"
import type { Book, Download } from "@/lib/types"
import { booksData } from "@/lib/books-data"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

type BookRow = Record<string, unknown> & { id: number; title: string; author: string; category: string }

function mapBook(row: BookRow): Book {
  return {
    id: Number(row.id), title: row.title, author: row.author, category: row.category,
    rating: Number(row.rating ?? 0), year: Number(row.year ?? 0), pages: row.pages == null ? undefined : Number(row.pages),
    language: String(row.language ?? "العربية"), description: String(row.description ?? ""),
    downloadUrl: (row.download_url as string | null) ?? undefined, imageUrl: (row.image_url as string | null) ?? undefined,
    downloadCount: Number(row.download_count ?? 0), addedDate: (row.added_date as string | null) ?? undefined,
    fileSize: (row.file_size as string | null) ?? undefined, format: (row.format as string | null) ?? "PDF",
    comments: Array.isArray(row.comments) ? row.comments as Book["comments"] : [],
  }
}

async function queryBooks(query: () => PromiseLike<{ data: BookRow[] | null; error: unknown }>, fallback: () => Book[]) {
  try {
    const { data, error } = await query()
    if (error || !data) return fallback()
    return data.map(mapBook)
  } catch {
    return fallback()
  }
}

export async function getAllBooks(): Promise<Book[]> {
  return queryBooks(() => supabase.from("books").select("*").order("title").returns<BookRow[]>(), () => [...booksData])
}

export async function getBookById(id: number): Promise<Book | undefined> {
  try {
    const { data, error } = await supabase.from("books").select("*").eq("id", id).maybeSingle()
    if (error) return booksData.find((book) => book.id === id)
    return data ? mapBook(data as BookRow) : undefined
  } catch {
    return booksData.find((book) => book.id === id)
  }
}

export async function getBooksByCategory(category: string): Promise<Book[]> {
  return queryBooks(() => supabase.from("books").select("*").eq("category", category).order("title").returns<BookRow[]>(), () => booksData.filter((book) => book.category === category))
}

export async function getBooksByAuthor(author: string): Promise<Book[]> {
  return queryBooks(() => supabase.from("books").select("*").eq("author", author).order("title").returns<BookRow[]>(), () => booksData.filter((book) => book.author === author))
}

export async function getCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from("categories").select("name").order("name")
    if (error || !data) return [...new Set(booksData.map((book) => book.category))].sort()
    return data.map((row) => row.name)
  } catch {
    return [...new Set(booksData.map((book) => book.category))].sort()
  }
}

export async function getAuthors(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from("books").select("author").order("author")
    if (error || !data) return [...new Set(booksData.map((book) => book.author))].sort()
    return [...new Set(data.map((row) => row.author))]
  } catch {
    return [...new Set(booksData.map((book) => book.author))].sort()
  }
}

export async function searchBooks(search: string): Promise<Book[]> {
  const term = search.trim().replace(/[,%()]/g, " ")
  if (!term) return []
  return queryBooks(() => supabase.from("books").select("*").or(`title.ilike.%${term}%,author.ilike.%${term}%,category.ilike.%${term}%`).returns<BookRow[]>(), () => {
    const needle = search.toLocaleLowerCase()
    return booksData.filter((book) => [book.title, book.author, book.category].some((value) => value.toLocaleLowerCase().includes(needle)))
  })
}

export async function getNewestBooks(limit = 10): Promise<Book[]> {
  return queryBooks(() => supabase.from("books").select("*").order("added_date", { ascending: false }).limit(limit).returns<BookRow[]>(), () => [...booksData].sort((a, b) => new Date(b.addedDate ?? 0).getTime() - new Date(a.addedDate ?? 0).getTime()).slice(0, limit))
}

export async function getMostDownloadedBooks(limit = 10): Promise<Book[]> {
  return queryBooks(() => supabase.from("books").select("*").gt("download_count", 0).order("download_count", { ascending: false }).limit(limit).returns<BookRow[]>(), () => [...booksData].filter((book) => (book.downloadCount ?? 0) > 0).sort((a, b) => (b.downloadCount ?? 0) - (a.downloadCount ?? 0)).slice(0, limit))
}

export async function getMostRatedBooks(limit = 10): Promise<Book[]> {
  return queryBooks(() => supabase.from("books").select("*").order("rating", { ascending: false }).limit(limit).returns<BookRow[]>(), () => [...booksData].sort((a, b) => b.rating - a.rating).slice(0, limit))
}

export async function getLibraryStats() {
  const books = await getAllBooks()
  const categories = await getCategories()
  const totalBooks = books.length
  return {
    totalBooks,
    totalCategories: categories.length,
    totalAuthors: new Set(books.map((book) => book.author)).size,
    totalDownloads: books.reduce((total, book) => total + (book.downloadCount ?? 0), 0),
    averageRating: totalBooks ? Math.round(books.reduce((sum, book) => sum + book.rating, 0) / totalBooks * 10) / 10 : 0,
    totalPages: books.reduce((sum, book) => sum + (book.pages ?? 0), 0),
  }
}

export { type Download }
