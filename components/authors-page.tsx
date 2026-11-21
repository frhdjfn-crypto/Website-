"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Search, BookOpen, Filter, Grid, List, User, Star, Calendar } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AuthorInfo {
  name: string
  bookCount: number
  averageRating: number
  categories: string[]
  yearRange: { start: number; end: number }
  totalPages: number
  isFavorite: boolean
  bio: string
  nationality: string
  birthYear?: number
  deathYear?: number
}

export function AuthorsPage({ authorNames, allBooks, stats }: { authorNames: string[]; allBooks: import("@/lib/types").Book[]; stats: { totalBooks: number; averageRating: number } }) {
  const [authors, setAuthors] = useState<AuthorInfo[]>([])
  const [filteredAuthors, setFilteredAuthors] = useState<AuthorInfo[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterBy, setFilterBy] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [favorites, setFavorites] = useState<string[]>([])
  const router = useRouter()
  const { toast } = useToast()

  // معلومات إضافية عن المؤلفين
  const authorDetails: Record<string, Partial<AuthorInfo>> = {
    "باولو كويلو": {
      bio: "كاتب برازيلي مشهور، اشتهر برواية الخيميائي التي ترجمت إلى أكثر من 80 لغة",
      nationality: "البرازيل",
      birthYear: 1947,
    },
    "ستيفن كوفي": {
      bio: "كاتب أمريكي متخصص في التنمية البشرية والقيادة، مؤلف كتاب العادات السبع",
      nationality: "الولايات المتحدة",
      birthYear: 1932,
      deathYear: 2012,
    },
    "يوفال نوح هراري": {
      bio: "مؤرخ إسرائيلي ومؤلف كتب علمية شهيرة مثل الإنسان العاقل",
      nationality: "إسرائيل",
      birthYear: 1976,
    },
    "تشارلز دويج": {
      bio: "صحفي أمريكي ومؤلف كتب في علم النفس والسلوك",
      nationality: "الولايات المتحدة",
      birthYear: 1974,
    },
    "صفي الرحمن المباركفوري": {
      bio: "عالم هندي متخصص في السيرة النبوية، مؤلف كتاب الرحيق المختوم",
      nationality: "الهند",
      birthYear: 1943,
      deathYear: 2006,
    },
    "غابرييل غارسيا ماركيز": {
      bio: "كاتب كولومبي حائز على جائزة نوبل للأدب، رائد الواقعية السحرية",
      nationality: "كولومبيا",
      birthYear: 1927,
      deathYear: 2014,
    },
    "نابليون هيل": {
      bio: "كاتب أمريكي رائد في مجال التنمية الذاتية والنجاح المالي",
      nationality: "الولايات المتحدة",
      birthYear: 1883,
      deathYear: 1970,
    },
    "ابن كثير": {
      bio: "مؤرخ ومفسر إسلامي شهير، مؤلف البداية والنهاية وتفسير القرآن العظيم",
      nationality: "الشام",
      birthYear: 1300,
      deathYear: 1373,
    },
    "أحلام مستغانمي": {
      bio: "روائية جزائرية معاصرة، من أشهر الكاتبات العربيات",
      nationality: "الجزائر",
      birthYear: 1953,
    },
    "دانييل جولمان": {
      bio: "عالم نفس أمريكي، رائد في مجال الذكاء العاطفي",
      nationality: "الولايات المتحدة",
      birthYear: 1946,
    },
    الطبري: {
      bio: "مؤرخ ومفسر إسلامي عظيم، مؤلف تاريخ الطبري وتفسير الطبري",
      nationality: "فارس",
      birthYear: 839,
      deathYear: 923,
    },
    "ديل كارنيجي": {
      bio: "كاتب أمريكي رائد في مجال التنمية البشرية والعلاقات الإنسانية",
      nationality: "الولايات المتحدة",
      birthYear: 1888,
      deathYear: 1955,
    },
    "جورج أورويل": {
      bio: "كاتب إنجليزي شهير، مؤلف روايات 1984 ومزرعة الحيوان",
      nationality: "إنجلترا",
      birthYear: 1903,
      deathYear: 1950,
    },
    "روبرت كيوساكي": {
      bio: "رجل أعمال أمريكي ومؤلف كتب في التعليم المالي",
      nationality: "الولايات المتحدة",
      birthYear: 1947,
    },
    "ابن خلدون": {
      bio: "مؤرخ وعالم اجتماع عربي، رائد علم الاجتماع الحديث",
      nationality: "الأندلس",
      birthYear: 1332,
      deathYear: 1406,
    },
    "فيودور دوستويفسكي": {
      bio: "روائي روسي عظيم، من أعظم كتاب الأدب العالمي",
      nationality: "روسيا",
      birthYear: 1821,
      deathYear: 1881,
    },
    "جرجي زيدان": {
      bio: "كاتب ومؤرخ لبناني، رائد الرواية التاريخية العربية",
      nationality: "لبنان",
      birthYear: 1861,
      deathYear: 1914,
    },
    "مارتن سليجمان": {
      bio: "عالم نفس أمريكي، رائد علم النفس الإيجابي",
      nationality: "الولايات المتحدة",
      birthYear: 1942,
    },
    "لينوس بولينغ": {
      bio: "عالم كيمياء أمريكي، حائز على جائزتي نوبل",
      nationality: "الولايات المتحدة",
      birthYear: 1901,
      deathYear: 1994,
    },
    "هنري هازليت": {
      bio: "اقتصادي وصحفي أمريكي، متخصص في الاقتصاد الحر",
      nationality: "الولايات المتحدة",
      birthYear: 1894,
      deathYear: 1993,
    },
    "بيل جيتس": {
      bio: "رجل أعمال أمريكي، مؤسس شركة مايكروسوفت",
      nationality: "الولايات المتحدة",
      birthYear: 1955,
    },
    "سون تزو": {
      bio: "جنرال وفيلسوف صيني قديم، مؤلف كتاب فن الحرب",
      nationality: "الصين",
      birthYear: -544,
      deathYear: -496,
    },
    أرسطو: {
      bio: "فيلسوف يوناني عظيم، من أعظم المفكرين في التاريخ",
      nationality: "اليونان",
      birthYear: -384,
      deathYear: -322,
    },
    "محمد يوسف الكاندهلوي": {
      bio: "عالم هندي متخصص في الحديث والسيرة النبوية",
      nationality: "الهند",
      birthYear: 1917,
      deathYear: 1965,
    },
    "ألبرت أينشتاين": {
      bio: "عالم فيزياء ألماني، صاحب نظرية النسبية",
      nationality: "ألمانيا",
      birthYear: 1879,
      deathYear: 1955,
    },
  }

  useEffect(() => {
    // تحميل المفضلة من localStorage
    const savedFavorites = localStorage.getItem("favoriteAuthors")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    // إنشاء بيانات المؤلفين
    const authorData = authorNames.map((name) => {
      const books = allBooks.filter((book) => book.author === name)
      const averageRating = books.reduce((sum, book) => sum + book.rating, 0) / books.length
      const categories = [...new Set(books.map((book) => book.category))]
      const years = books.map((book) => book.year)
      const totalPages = books.reduce((sum, book) => sum + (book.pages || 0), 0)

      return {
        name,
        bookCount: books.length,
        averageRating: Math.round(averageRating * 10) / 10,
        categories,
        yearRange: { start: Math.min(...years), end: Math.max(...years) },
        totalPages,
        isFavorite: false,
        bio: authorDetails[name]?.bio || "معلومات غير متوفرة حالياً",
        nationality: authorDetails[name]?.nationality || "غير محدد",
        birthYear: authorDetails[name]?.birthYear,
        deathYear: authorDetails[name]?.deathYear,
      }
    })

    setAuthors(authorData)
    setFilteredAuthors(authorData)
  }, [])

  useEffect(() => {
    // تحديث حالة المفضلة
    const updatedAuthors = authors.map((author) => ({
      ...author,
      isFavorite: favorites.includes(author.name),
    }))
    setAuthors(updatedAuthors)
    setFilteredAuthors(updatedAuthors)
  }, [favorites])

  useEffect(() => {
    // تطبيق البحث والفلترة
    let filtered = authors.filter((author) => author.name.toLowerCase().includes(searchQuery.toLowerCase()))

    // فلترة حسب الجنسية
    if (filterBy !== "all") {
      filtered = filtered.filter((author) => author.nationality === filterBy)
    }

    // ترتيب النتائج
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "bookCount":
          return b.bookCount - a.bookCount
        case "rating":
          return b.averageRating - a.averageRating
        case "nationality":
          return a.nationality.localeCompare(b.nationality)
        case "favorites":
          return b.isFavorite === a.isFavorite ? 0 : b.isFavorite ? 1 : -1
        default:
          return 0
      }
    })

    setFilteredAuthors(filtered)
  }, [searchQuery, sortBy, filterBy, authors])

  const toggleFavorite = (authorName: string) => {
    const newFavorites = favorites.includes(authorName)
      ? favorites.filter((fav) => fav !== authorName)
      : [...favorites, authorName]

    setFavorites(newFavorites)
    localStorage.setItem("favoriteAuthors", JSON.stringify(newFavorites))

    toast({
      title: favorites.includes(authorName) ? "تم الإزالة من المفضلة" : "تم الإضافة للمفضلة",
      description: `المؤلف "${authorName}" ${favorites.includes(authorName) ? "أزيل من" : "أضيف إلى"} المفضلة`,
    })
  }

  const navigateToAuthor = (authorName: string) => {
    router.push(`/author/${encodeURIComponent(authorName)}`)
  }

  const nationalities = [...new Set(authors.map((author) => author.nationality))].sort()

  return (
    <div className="space-y-6">
      {/* العنوان والإحصائيات */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">المؤلفون</h1>
        <p className="text-muted-foreground mb-4">
          اكتشف {authors.length} مؤلف من مختلف أنحاء العالم وتخصصاتهم المتنوعة
        </p>
        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
          <span>👥 {authors.length} مؤلف</span>
          <span>🌍 {nationalities.length} جنسية</span>
          <span>❤️ {favorites.length} مفضل</span>
        </div>
      </div>

      {/* شريط البحث والفلترة */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="ابحث عن المؤلفين..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="فلترة حسب الجنسية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الجنسيات</SelectItem>
                {nationalities.map((nationality) => (
                  <SelectItem key={nationality} value={nationality}>
                    {nationality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">ترتيب أبجدي</SelectItem>
                <SelectItem value="bookCount">عدد الكتب</SelectItem>
                <SelectItem value="rating">التقييم</SelectItem>
                <SelectItem value="nationality">الجنسية</SelectItem>
                <SelectItem value="favorites">المفضلة أولاً</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* عرض المؤلفين */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuthors.map((author) => (
            <Card
              key={author.name}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
              onClick={() => navigateToAuthor(author.name)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {author.name}
                      </CardTitle>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary">{author.bookCount} كتاب</Badge>
                      <Badge variant="outline">{author.nationality}</Badge>
                    </div>
                    {(author.birthYear || author.deathYear) && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {author.birthYear && `${author.birthYear}`}
                          {author.deathYear && ` - ${author.deathYear}`}
                          {author.birthYear && !author.deathYear && " - الآن"}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(author.name)
                    }}
                    className="p-1 h-8 w-8"
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        author.isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{author.bio}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>التقييم:</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{author.averageRating} ⭐</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>التخصصات:</span>
                    <span className="text-xs">{author.categories.slice(0, 2).join(", ")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>الفترة:</span>
                    <span className="text-xs">
                      {author.yearRange.start === author.yearRange.end
                        ? author.yearRange.start
                        : `${author.yearRange.start}-${author.yearRange.end}`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center mt-4 pt-3 border-t">
                  <div className="flex items-center gap-1 text-primary">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">استكشف الأعمال</span>
                  </div>
                </div>
              </CardContent>
              {author.isFavorite && (
                <div className="absolute top-2 left-2">
                  <Badge variant="destructive" className="text-xs">
                    مفضل
                  </Badge>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            {filteredAuthors.map((author, index) => (
              <div
                key={author.name}
                className={`flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                  index !== filteredAuthors.length - 1 ? "border-b" : ""
                }`}
                onClick={() => navigateToAuthor(author.name)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{author.name}</h3>
                      {author.isFavorite && <Heart className="h-4 w-4 fill-red-500 text-red-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{author.bio}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {author.nationality}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{author.categories.slice(0, 2).join(", ")}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{author.bookCount}</div>
                    <p className="text-xs text-muted-foreground">كتاب</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{author.averageRating}</span>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">تقييم</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(author.name)
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${author.isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                  />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {filteredAuthors.length === 0 && (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا يوجد مؤلفون</h3>
          <p className="text-muted-foreground">لم نجد مؤلفين يطابقون معايير البحث</p>
        </div>
      )}
    </div>
  )
}
