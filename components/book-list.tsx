"use client"

import { useState } from "react"
import Link from "next/link"
import { Download, Star } from "lucide-react"
import { BookCover } from "@/components/book-cover"
import { getAllBooks } from "@/lib/books-data"
import { imageManager } from "@/lib/image-manager"
import type { Book } from "@/lib/types"

function formatDownloadCount(count: number) {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toLocaleString()
}

function HomeBookCard({ book }: { book: Book }) {
  const image = imageManager.getBookCover(book.id)
  const imageUrl = image?.url || book.imageUrl

  return (
    <article className="min-w-0">
      <Link href={`/book/${book.id}`} className="group block overflow-hidden rounded-lg">
        <BookCover src={imageUrl} alt={`غلاف كتاب ${book.title}`} className="aspect-[3/4] rounded-lg" />
      </Link>
      <div className="flex flex-col items-center gap-2 px-1 pt-3 text-center">
        <Link href={`/book/${book.id}`} className="w-full min-w-0">
          <h3 className="line-clamp-2 text-base font-bold leading-tight">{book.title}</h3>
        </Link>
        <div className="flex items-center gap-1 text-xs text-green-600">
          <Download className="h-3 w-3" />
          <span>{formatDownloadCount(book.downloadCount || 0)}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-yellow-600">
          <span>{book.rating.toFixed(1)}</span>
          <Star className="h-3 w-3 fill-current" />
        </div>
      </div>
    </article>
  )
}

export function BookList() {
  const [books] = useState<Book[]>(() => {
    const uniqueBooks = new Map(getAllBooks().map((book) => [book.id, book]))
    return Array.from(uniqueBooks.values()).slice(0, 10)
  })

  return (
    <div className="mb-10 w-full min-w-0">
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {books.map((book) => (
          <HomeBookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}
