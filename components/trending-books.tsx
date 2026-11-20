"use client"

import { Download, Star, TrendingUp } from "lucide-react"
import { BookCard } from "@/components/book-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Book } from "@/lib/types"

export function TrendingBooks({ mostDownloaded, highestRated }: { mostDownloaded: Book[]; highestRated: Book[] }) {
  return (
    <section className="flex flex-col gap-6">
      <header className="text-center">
        <p className="text-sm font-medium text-primary">اختيارات القراء</p>
        <h1 className="mt-1 text-3xl font-bold">الكتب الرائجة</h1>
        <p className="mt-2 text-muted-foreground">اكتشف الكتب الأكثر قراءة وتقييماً في زيتونة بوك</p>
      </header>
      <Tabs defaultValue="downloads" dir="rtl" className="w-full">
        <TabsList className="mx-auto grid w-full max-w-lg grid-cols-2">
          <TabsTrigger value="downloads"><Download data-icon="inline-start" /> الأكثر تحميلاً</TabsTrigger>
          <TabsTrigger value="ratings"><Star data-icon="inline-start" /> الأعلى تقييماً</TabsTrigger>
        </TabsList>
        <TabsContent value="downloads" className="mt-6">
          <TrendingGrid title="الأكثر تحميلاً" description="الكتب التي يختارها قراؤنا باستمرار" icon="download" books={mostDownloaded} />
        </TabsContent>
        <TabsContent value="ratings" className="mt-6">
          <TrendingGrid title="الأعلى تقييماً" description="أعلى الكتب تقييماً من مجتمع القراء" icon="rating" books={highestRated} />
        </TabsContent>
      </Tabs>
    </section>
  )
}

function TrendingGrid({ title, description, icon, books }: { title: string; description: string; icon: "download" | "rating"; books: Book[] }) {
  const Icon = icon === "download" ? Download : TrendingUp
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Icon className="size-5 text-primary" />{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {books.length ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {books.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        ) : (
          <p className="py-12 text-center text-muted-foreground">لا توجد كتب متاحة حالياً</p>
        )}
      </CardContent>
    </Card>
  )
}
