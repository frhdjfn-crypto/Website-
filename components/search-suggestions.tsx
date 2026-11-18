"use client"

import { useState, useEffect } from "react"
import { searchBooks, getCategories } from "@/lib/books-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, User, Tag } from "lucide-react"

interface SearchSuggestionsProps {
  query: string
  onSuggestionClick: (suggestion: string) => void
  className?: string
}

export function SearchSuggestions({ query, onSuggestionClick, className }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<{
    books: string[]
    authors: string[]
    categories: string[]
  }>({
    books: [],
    authors: [],
    categories: [],
  })

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions({ books: [], authors: [], categories: [] })
      return
    }

    const lowercaseQuery = query.toLowerCase()

    // اقتراحات الكتب
    const bookResults = searchBooks(query)
    const bookSuggestions = bookResults.slice(0, 3).map((book) => book.title)

    // اقتراحات المؤلفين - استخراج المؤلفين من نتائج البحث
    const authorSuggestions = [
      ...new Set(
        bookResults.map((book) => book.author).filter((author) => author.toLowerCase().includes(lowercaseQuery)),
      ),
    ].slice(0, 3)

    // اقتراحات التصنيفات
    const categories = getCategories()
    const categorySuggestions = categories
      .filter((category) => category.toLowerCase().includes(lowercaseQuery))
      .slice(0, 3)

    setSuggestions({
      books: bookSuggestions,
      authors: authorSuggestions,
      categories: categorySuggestions,
    })
  }, [query])

  const hasAnySuggestions =
    suggestions.books.length > 0 || suggestions.authors.length > 0 || suggestions.categories.length > 0

  if (!hasAnySuggestions) {
    return null
  }

  return (
    <div className={`bg-background border rounded-lg shadow-lg p-4 space-y-4 ${className}`}>
      {suggestions.books.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">الكتب</span>
          </div>
          <div className="space-y-1">
            {suggestions.books.map((book, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-right h-auto p-2"
                onClick={() => onSuggestionClick(book)}
              >
                <span className="truncate">{book}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {suggestions.authors.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">المؤلفون</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {suggestions.authors.map((author, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => onSuggestionClick(author)}
              >
                {author}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {suggestions.categories.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">التصنيفات</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {suggestions.categories.map((category, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-muted"
                onClick={() => onSuggestionClick(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
