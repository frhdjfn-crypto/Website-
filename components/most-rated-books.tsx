"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star, StarHalf, TrendingUp } from "lucide-react"

const topRatedBooks = [
  { title: "الخيميائي", author: "باولو كويلو", rating: 4.5 },
  { title: "العادات السبع", author: "ستيفن كوفي", rating: 4.0 },
  { title: "الإنسان العاقل", author: "يوفال نوح هراري", rating: 4.8 },
  { title: "قوة العادات", author: "تشارلز دويج", rating: 4.0 },
  { title: "الرحيق المختوم", author: "صفي الرحمن المباركفوري", rating: 4.9 },
]

export function MostRatedBooks() {
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="h-4 w-4 text-yellow-400" />
        ))}
        <span className="mr-1 text-sm">({rating})</span>
      </div>
    )
  }

  return (
    <Card className="mb-8 dark:bg-gray-800">
      <CardHeader>
        <h3 className="flex items-center gap-2 text-xl font-bold text-primary">
          <TrendingUp className="h-5 w-5" /> الكتب الأعلى تقييماً
        </h3>
      </CardHeader>
      <CardContent>
        <ul className="divide-y dark:divide-gray-700">
          {topRatedBooks.map((book, index) => (
            <li key={index} className="flex items-center justify-between py-3">
              <span>{book.title}</span>
              {renderRating(book.rating)}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
