"use client"

import { useRouter } from "next/navigation"
import { BookIcon } from "lucide-react"
import { imageManager } from "@/lib/image-manager"
import type { Book } from "@/lib/types"
import Image from "next/image"
import { useState } from "react"

interface BookCardProps {
  book: Book
  onAddComment?: (bookId: number, text: string, author: string) => void
}

export function BookCard({ book }: BookCardProps) {
  const [imageError, setImageError] = useState(false)
  const router = useRouter()

  const bookCover = imageManager.getBookCover(book.id)
  const displayImageUrl = bookCover?.url || book.imageUrl

  const handleClick = () => {
    router.push(`/book/${book.id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      {/* صورة غلاف الكتاب */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary-dark/10 overflow-hidden">
        {displayImageUrl && !imageError ? (
          <Image
            src={displayImageUrl}
            alt={`غلاف كتاب ${book.title}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white">
            <BookIcon className="h-16 w-16 opacity-90" />
          </div>
        )}

        {/* تدرج في الأسفل */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* عنوان الكتاب فقط */}
        <div className="absolute inset-x-0 bottom-0 p-3 text-white">
          <h3 className="text-base font-bold leading-tight line-clamp-3">{book.title}</h3>
        </div>
      </div>
    </div>
  )
}
