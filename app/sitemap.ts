import type { MetadataRoute } from "next"
import { getAllBooks, getAuthors, getCategories } from "@/lib/books-data"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zeitounabook.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/categories", "/authors", "/trending", "/search", "/auth", "/library", "/downloads", "/profile"]
  const staticPages = pages.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }))
  const books = getAllBooks().map((book) => ({
    url: new URL(`/book/${book.id}`, siteUrl).toString(),
    lastModified: new Date(book.addedDate || "2024-01-01"),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))
  const categories = getCategories().map((category) => ({
    url: new URL(`/category/${encodeURIComponent(category)}`, siteUrl).toString(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))
  const authors = getAuthors().map((author) => ({
    url: new URL(`/author/${encodeURIComponent(author)}`, siteUrl).toString(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  return [...staticPages, ...books, ...categories, ...authors]
}
