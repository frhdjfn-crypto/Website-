"use client"

import { useState } from "react"
import { BookCard } from "@/components/book-card"
import { getAllBooks } from "@/lib/books-data"
import type { Book } from "@/lib/types"

export function BookList() {
  const [books] = useState<Book[]>(getAllBooks().slice(0, 10)) // تعديل هنا لعرض 10 كتب فقط

  return (
    <div className="mb-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}
