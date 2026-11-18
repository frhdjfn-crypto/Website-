"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookCard } from "@/components/book-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, BookOpen, Filter, User, Calendar, Globe, Award, Heart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Book } from "@/lib/types"

interface AuthorDetailProps {
  authorName: string
  books: Book[]
}

export function AuthorDetail({ authorName, books }: AuthorDetailProps) {
  const [sortedBooks, setSortedBooks] = useState<Book[]>(books)
  const [sortBy, setSortBy] = useState("rating")
  const [isFavorite, setIsFavorite] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // معلومات إضافية عن المؤلفين (نفس البيانات من الصفحة الرئيسية)
  const authorDetails: Record<string, any> = {
    "باولو كويلو": {
      bio: "كاتب برازيلي مشهور عالمياً، ولد في ريو دي جانيرو عام 1947. اشتهر برواية 'الخيميائي' التي ترجمت إلى أكثر من 80 لغة وبيعت منها أكثر من 65 مليون نسخة حول العالم. يعتبر من أكثر الكتاب قراءة في العالم، وتتميز أعماله بالفلسفة الروحانية والبحث عن المعنى.",
      nationality: "البرازيل",
      birthYear: 1947,
      awards: ["وسام الشرف الفرنسي", "جائزة الكريستال من المنتدى الاقتصادي العالمي"],
      website: "paulocoelho.com",
      famousQuote: "عندما تريد شيئاً بصدق، فإن الكون كله يتآمر لمساعدتك على تحقيقه",
    },
    "ستيفن كوفي": {
      bio: "كاتب أمريكي ومتحدث تحفيزي، متخصص في التنمية البشرية والقيادة. ولد عام 1932 وتوفي عام 2012. حصل على درجة الدكتوراه من جامعة بريغهام يونغ. يعتبر كتابه 'العادات السبع للناس الأكثر فعالية' من أهم كتب التنمية البشرية في التاريخ.",
      nationality: "الولايات المتحدة",
      birthYear: 1932,
      deathYear: 2012,
      awards: ["جائزة الأب الأمريكي", "جائزة المعلم الدولي للعام"],
      famousQuote: "ابدأ بالنهاية في ذهنك",
    },
    "يوفال نوح هراري": {
      bio: "مؤرخ إسرائيلي ومؤلف كتب علمية شهيرة. ولد عام 1976، وهو أستاذ في قسم التاريخ بالجامعة العبرية في القدس. اشتهر بثلاثيته: الإنسان العاقل، الإنسان الإله، و21 درساً للقرن الحادي والعشرين. تُرجمت كتبه إلى أكثر من 60 لغة.",
      nationality: "إسرائيل",
      birthYear: 1976,
      awards: ["جائزة بولونسكي", "جائزة أكاديمية الكتاب البريطانية"],
      website: "ynharari.com",
      famousQuote: "التاريخ بدأ عندما اخترع البشر الآلهة، وسينتهي عندما يصبحون آلهة",
    },
    // يمكن إضافة المزيد من التفاصيل للمؤلفين الآخرين
  }

  const authorInfo = authorDetails[authorName] || {
    bio: "معلومات غير متوفرة حالياً عن هذا المؤلف.",
    nationality: "غير محدد",
    awards: [],
    famousQuote: "",
  }

  const handleSort = (value: string) => {
    setSortBy(value)
    const sorted = [...books].sort((a, b) => {
      switch (value) {
        case "rating":
          return b.rating - a.rating
        case "year":
          return b.year - a.year
        case "title":
          return a.title.localeCompare(b.title)
        case "pages":
          return (b.pages || 0) - (a.pages || 0)
        case "category":
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })
    setSortedBooks(sorted)
  }

  const addComment = (bookId: number, text: string, author: string) => {
    setSortedBooks(
      sortedBooks.map((book) => {
        if (book.id === bookId) {
          return {
            ...book,
            comments: [...book.comments, { text, author, date: new Date().toLocaleDateString("ar-SA") }],
          }
        }
        return book
      }),
    )
  }

  const toggleFavoriteAuthor = () => {
    const favorites = JSON.parse(localStorage.getItem("favoriteAuthors") || "[]")
    const newFavorites = isFavorite ? favorites.filter((fav: string) => fav !== authorName) : [...favorites, authorName]

    localStorage.setItem("favoriteAuthors", JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)

    toast({
      title: isFavorite ? "تم الإزالة من المفضلة" : "تم الإضافة للمفضلة",
      description: `المؤلف "${authorName}" ${isFavorite ? "أزيل من" : "أضيف إلى"} المفضلة`,
    })
  }

  // إحصائيات المؤلف
  const averageRating = books.reduce((sum, book) => sum + book.rating, 0) / books.length
  const totalPages = books.reduce((sum, book) => sum + (book.pages || 0), 0)
  const categories = [...new Set(books.map((book) => book.category))]
  const latestYear = Math.max(...books.map((book) => book.year))
  const oldestYear = Math.min(...books.map((book) => book.year))
  const totalComments = books.reduce((sum, book) => sum + book.comments.length, 0)

  return (
    <div className="space-y-6">
      {/* زر العودة */}
      <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2 hover:bg-muted">
        <ArrowRight className="h-4 w-4" />
        العودة للمؤلفين
      </Button>

      {/* معلومات المؤلف */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* البطاقة الشخصية */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{authorName}</CardTitle>
                  <p className="text-muted-foreground">{authorInfo.nationality}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={toggleFavoriteAuthor}>
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(authorInfo.birthYear || authorInfo.deathYear) && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {authorInfo.birthYear && `${authorInfo.birthYear}`}
                  {authorInfo.deathYear && ` - ${authorInfo.deathYear}`}
                  {authorInfo.birthYear && !authorInfo.deathYear && " - الآن"}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{authorInfo.nationality}</span>
            </div>

            {authorInfo.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`https://${authorInfo.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {authorInfo.website}
                </a>
              </div>
            )}

            {authorInfo.awards && authorInfo.awards.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">الجوائز والتكريمات:</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {authorInfo.awards.map((award: string, index: number) => (
                    <li key={index} className="mr-4">
                      • {award}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {authorInfo.famousQuote && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm italic">"{authorInfo.famousQuote}"</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* نبذة وإحصائيات */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>نبذة عن المؤلف</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">{authorInfo.bio}</p>

            <Separator />

            {/* إحصائيات المؤلف */}
            <div>
              <h3 className="text-lg font-semibold mb-4">إحصائيات الأعمال</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{books.length}</div>
                  <p className="text-sm text-muted-foreground">كتاب</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{averageRating.toFixed(1)}</div>
                  <p className="text-sm text-muted-foreground">متوسط التقييم</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{totalPages.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">صفحة</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{categories.length}</div>
                  <p className="text-sm text-muted-foreground">تخصص</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* التخصصات */}
            <div>
              <h3 className="text-lg font-semibold mb-3">التخصصات</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* شريط الفلترة */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              أعمال المؤلف ({books.length})
            </h3>
            <Select value={sortBy} onValueChange={handleSort}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">الأعلى تقييماً</SelectItem>
                <SelectItem value="year">الأحدث</SelectItem>
                <SelectItem value="title">ترتيب أبجدي</SelectItem>
                <SelectItem value="pages">عدد الصفحات</SelectItem>
                <SelectItem value="category">التصنيف</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* عرض الكتب */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedBooks.map((book) => (
          <BookCard key={book.id} book={book} onAddComment={addComment} />
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد كتب</h3>
          <p className="text-muted-foreground">لا توجد كتب لهذا المؤلف حالياً</p>
        </div>
      )}
    </div>
  )
}
