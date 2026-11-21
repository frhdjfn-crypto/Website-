"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"
import {
  BookOpen,
  Search,
  Filter,
  Grid,
  List,
  Trash2,
  Star,
  Download,
  Eye,
  Plus,
  BookMarked,
  Clock,
  CheckCircle,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Book } from "@/lib/types"
import Image from "next/image"

interface ReadingStatus {
  bookId: number
  status: "want-to-read" | "reading" | "completed"
  progress: number
  startDate?: string
  endDate?: string
  rating?: number
  notes?: string
}

export function PersonalLibrary({ allBooks }: { allBooks: Book[] }) {
  const { user, library, addToLibrary } = useAuth()
  const [libraryBooks, setLibraryBooks] = useState<Book[]>([])
  const [readingStatuses, setReadingStatuses] = useState<ReadingStatus[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("dateAdded")
  const [filterBy, setFilterBy] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("all")
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // تحميل كتب المكتبة
    const userBooks = allBooks.filter((book) => library.includes(book.title))
    setLibraryBooks(userBooks)

    // تحميل حالات القراءة من localStorage
    const savedStatuses = localStorage.getItem(`readingStatuses_${user?.email || "guest"}`)
    if (savedStatuses) {
      setReadingStatuses(JSON.parse(savedStatuses))
    }
  }, [library, user])

  const saveReadingStatuses = (statuses: ReadingStatus[]) => {
    setReadingStatuses(statuses)
    localStorage.setItem(`readingStatuses_${user?.email || "guest"}`, JSON.stringify(statuses))
  }

  const updateReadingStatus = (bookId: number, status: ReadingStatus["status"], progress?: number) => {
    const existingIndex = readingStatuses.findIndex((s) => s.bookId === bookId)
    const newStatuses = [...readingStatuses]

    if (existingIndex >= 0) {
      newStatuses[existingIndex] = {
        ...newStatuses[existingIndex],
        status,
        progress: progress ?? newStatuses[existingIndex].progress,
        startDate:
          status === "reading" && !newStatuses[existingIndex].startDate
            ? new Date().toISOString().split("T")[0]
            : newStatuses[existingIndex].startDate,
        endDate: status === "completed" ? new Date().toISOString().split("T")[0] : undefined,
      }
    } else {
      newStatuses.push({
        bookId,
        status,
        progress: progress ?? 0,
        startDate: status === "reading" ? new Date().toISOString().split("T")[0] : undefined,
        endDate: status === "completed" ? new Date().toISOString().split("T")[0] : undefined,
      })
    }

    saveReadingStatuses(newStatuses)
    toast({
      title: "تم تحديث حالة القراءة",
      description: `تم تحديث حالة الكتاب إلى: ${getStatusText(status)}`,
    })
  }

  const removeFromLibrary = (bookTitle: string) => {
    // هذه الوظيفة تحتاج إلى تحديث في AuthProvider
    toast({
      title: "تم حذف الكتاب",
      description: `تم حذف "${bookTitle}" من مكتبتك`,
      variant: "destructive",
    })
  }

  const getStatusText = (status: ReadingStatus["status"]) => {
    switch (status) {
      case "want-to-read":
        return "أريد قراءته"
      case "reading":
        return "أقرأه حالياً"
      case "completed":
        return "مكتمل"
      default:
        return "غير محدد"
    }
  }

  const getBookStatus = (bookId: number) => {
    return readingStatuses.find((s) => s.bookId === bookId)
  }

  const handleImageError = (bookId: number) => {
    setImageErrors((prev) => ({ ...prev, [bookId]: true }))
  }

  const getFilteredBooks = () => {
    let filtered = libraryBooks

    // فلترة حسب البحث
    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // فلترة حسب التصنيف
    if (filterBy !== "all") {
      filtered = filtered.filter((book) => book.category === filterBy)
    }

    // فلترة حسب التبويب النشط
    if (activeTab !== "all") {
      filtered = filtered.filter((book) => {
        const status = getBookStatus(book.id)
        return status?.status === activeTab
      })
    }

    // ترتيب
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "author":
          return a.author.localeCompare(b.author)
        case "rating":
          return b.rating - a.rating
        case "year":
          return b.year - a.year
        case "progress":
          const progressA = getBookStatus(a.id)?.progress || 0
          const progressB = getBookStatus(b.id)?.progress || 0
          return progressB - progressA
        default:
          return 0
      }
    })

    return filtered
  }

  const getLibraryStats = () => {
    const total = libraryBooks.length
    const wantToRead = readingStatuses.filter((s) => s.status === "want-to-read").length
    const reading = readingStatuses.filter((s) => s.status === "reading").length
    const completed = readingStatuses.filter((s) => s.status === "completed").length
    const averageRating = libraryBooks.reduce((sum, book) => sum + book.rating, 0) / total || 0

    return { total, wantToRead, reading, completed, averageRating }
  }

  const stats = getLibraryStats()
  const filteredBooks = getFilteredBooks()
  const categories = [...new Set(libraryBooks.map((book) => book.category))]

  if (!user) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">مكتبتي الشخصية</h2>
        <p className="text-muted-foreground mb-4">يجب تسجيل الدخول أولاً لعرض مكتبتك الشخصية</p>
        <Button onClick={() => toast({ title: "تسجيل الدخول", description: "الرجاء تسجيل الدخول أولاً" })}>
          تسجيل الدخول
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* العنوان والترحيب */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">مكتبتي الشخصية</h1>
        <p className="text-muted-foreground">مرحباً {user.name}، إليك مجموعة كتبك المحفوظة</p>
      </div>

      {/* إحصائيات المكتبة */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الكتب</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">كتاب في مكتبتك</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أريد قراءته</CardTitle>
            <BookMarked className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.wantToRead}</div>
            <p className="text-xs text-muted-foreground">في قائمة الانتظار</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أقرأ حالياً</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.reading}</div>
            <p className="text-xs text-muted-foreground">قيد القراءة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مكتملة</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">تم إنجازها</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط التقييم</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">من 5 نجوم</p>
          </CardContent>
        </Card>
      </div>

      {/* شريط البحث والفلترة */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="ابحث في مكتبتك..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="فلترة حسب التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dateAdded">تاريخ الإضافة</SelectItem>
                <SelectItem value="title">العنوان</SelectItem>
                <SelectItem value="author">المؤلف</SelectItem>
                <SelectItem value="rating">التقييم</SelectItem>
                <SelectItem value="year">سنة النشر</SelectItem>
                <SelectItem value="progress">التقدم</SelectItem>
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

      {/* تبويبات حالة القراءة */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">الكل ({stats.total})</TabsTrigger>
          <TabsTrigger value="want-to-read">أريد قراءته ({stats.wantToRead})</TabsTrigger>
          <TabsTrigger value="reading">أقرأ حالياً ({stats.reading})</TabsTrigger>
          <TabsTrigger value="completed">مكتمل ({stats.completed})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{library.length === 0 ? "مكتبتك فارغة" : "لا توجد نتائج"}</h3>
              <p className="text-muted-foreground mb-4">
                {library.length === 0 ? "ابدأ بإضافة بعض الكتب إلى مكتبتك الشخصية" : "لا توجد كتب تطابق معايير البحث"}
              </p>
              {library.length === 0 && (
                <Button onClick={() => router.push("/")}>
                  <Plus className="mr-2 h-4 w-4" />
                  استكشف الكتب
                </Button>
              )}
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredBooks.map((book) => {
                const status = getBookStatus(book.id)
                return (
                  <Card key={book.id} className="group hover:shadow-lg transition-all duration-300">
                    {viewMode === "grid" ? (
                      <>
                        <div className="relative aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary-dark/10">
                          {book.imageUrl && !imageErrors[book.id] ? (
                            <Image
                              src={book.imageUrl || "/placeholder.svg"}
                              alt={`غلاف كتاب ${book.title}`}
                              fill
                              className="object-cover"
                              onError={() => handleImageError(book.id)}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white">
                              <BookOpen className="h-16 w-16 opacity-90" />
                            </div>
                          )}
                          {status && (
                            <Badge
                              className="absolute top-2 right-2"
                              variant={
                                status.status === "completed"
                                  ? "default"
                                  : status.status === "reading"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {getStatusText(status.status)}
                            </Badge>
                          )}
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{book.category}</Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{book.rating}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {status && status.status === "reading" && (
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>التقدم</span>
                                <span>{status.progress}%</span>
                              </div>
                              <Progress value={status.progress} className="h-2" />
                            </div>
                          )}
                          <div className="flex flex-col gap-2">
                            <Select
                              value={status?.status || "want-to-read"}
                              onValueChange={(value) => updateReadingStatus(book.id, value as ReadingStatus["status"])}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="want-to-read">أريد قراءته</SelectItem>
                                <SelectItem value="reading">أقرأه حالياً</SelectItem>
                                <SelectItem value="completed">مكتمل</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/book/${book.id}`)}
                                className="flex-1"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                عرض
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => removeFromLibrary(book.title)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </>
                    ) : (
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-20 bg-gradient-to-br from-primary/10 to-primary-dark/10 rounded flex-shrink-0">
                            {book.imageUrl && !imageErrors[book.id] ? (
                              <Image
                                src={book.imageUrl || "/placeholder.svg"}
                                alt={`غلاف كتاب ${book.title}`}
                                fill
                                className="object-cover rounded"
                                onError={() => handleImageError(book.id)}
                                sizes="80px"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white rounded">
                                <BookOpen className="h-8 w-8" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">{book.author}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {book.category}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{book.rating}</span>
                              </div>
                            </div>
                            {status && status.status === "reading" && (
                              <div className="mt-2">
                                <Progress value={status.progress} className="h-1" />
                                <span className="text-xs text-muted-foreground">{status.progress}% مكتمل</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge
                              variant={
                                status?.status === "completed"
                                  ? "default"
                                  : status?.status === "reading"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {getStatusText(status?.status || "want-to-read")}
                            </Badge>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" onClick={() => router.push(`/book/${book.id}`)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => removeFromLibrary(book.title)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
