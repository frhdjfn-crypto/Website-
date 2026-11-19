"use client"

import { useState } from "react"

interface BookCoverProps {
  src?: string
  alt: string
  className?: string
}

export function BookCover({ src, alt, className = "" }: BookCoverProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1e6641] to-[#2e8b57] text-4xl"
        >
          <span aria-hidden="true">📚</span>
        </div>
      )}
    </div>
  )
}
