"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Search, BookOpen, TrendingUp, Filter, Grid, List } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface CategoryInfo {
  name: string
  count: number
  averageRating: number
  isFavorite: boolean
  description: string
  color: string
}

export function CategoriesPage({ categoryNames, allBooks, stats }: { categoryNames: string[]; allBooks: import("@/lib/types").Book[]; stats: { totalBooks: number; averageRating: number } }) {
  // ألوان مختلفة للتصنيفات
  const categoryColors = [
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300",
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  ]

  // أوصاف التصنيفات
  const categoryDescriptions: Record<string, string> = {
    رواية: "عوالم خيالية وقصص مؤثرة تأخذك في رحلة عبر المشاعر والأحداث",
    "تنمية بشرية": "كتب تساعدك على تطوير ذاتك وتحقيق أهدافك الشخصية والمهنية",
    تاريخ: "استكشف الماضي وتعلم من أحداث التاريخ وشخصياته المؤثرة",
    "علم نفس": "فهم النفس البشرية والسلوك وطرق التعامل مع التحديات النفسية",
    سيرة: "قصص حياة الشخصيات المؤثرة والعبر المستفادة من تجاربهم",
    فلسفة: "تأملات عميقة في الوجود والحياة والمعنى من عقول الفلاسفة العظام",
    علوم: "اكتشافات علمية ونظريات تفسر عجائب الكون والطبيعة",
    أدب: "جمال اللغة والتعبير في أعمال أدبية راقية ومؤثرة",
    دين: "تعاليم دينية وروحانية تنير طريق الإيمان والهداية",
    سياسة: "فهم الأنظمة السياسية والحكم وتأثيرها على المجتمعات",
    اقتصاد: "مبادئ الاقتصاد والمال والاستثمار لفهم العالم المالي",
    تكنولوجيا: "آخر التطورات التقنية وتأثيرها على مستقبل البشرية",
  }

  const initialCategories = categoryNames.map((name, index) => {
    const books = allBooks.filter((book) => book.category === name)
    const averageRating = books.reduce((sum, book) => sum + book.rating, 0) / books.length
    return {
      name,
      count: books.length,
      averageRating: Math.round(averageRating * 10) / 10,
      isFavorite: false,
      description: categoryDescriptions[name] || "تصنيف متنوع من الكتب المفيدة",
      color: categoryColors[index % categoryColors.length],
    }
  })

  const [categories, setCategories] = useState<CategoryInfo[]>(initialCategories)
  const [filteredCategories, setFilteredCategories] = useState<CategoryInfo[]>(initialCategories)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [favorites, setFavorites] = useState<string[]>([])
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteCategories")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  useEffect(() => {
    // تحديث حالة المفضلة
    const updatedCategories = categories.map((cat) => ({
      ...cat,
      isFavorite: favorites.includes(cat.name),
    }))
    setCategories(updatedCategories)
    setFilteredCategories(updatedCategories)
  }, [favorites])

  useEffect(() => {
    // تطبيق البحث والفلترة
    const filtered = categories.filter((cat) => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))

    // ترتيب النتائج
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "count":
          return b.count - a.count
        case "rating":
          return b.averageRating - a.averageRating
        case "favorites":
          return b.isFavorite === a.isFavorite ? 0 : b.isFavorite ? 1 : -1
        default:
          return 0
      }
    })

    setFilteredCategories(filtered)
  }, [searchQuery, sortBy, categories])

  const toggleFavorite = (categoryName: string) => {
    const newFavorites = favorites.includes(categoryName)
      ? favorites.filter((fav) => fav !== categoryName)
      : [...favorites, categoryName]

    setFavorites(newFavorites)
    localStorage.setItem("favoriteCategories", JSON.stringify(newFavorites))

    toast({
      title: favorites.includes(categoryName) ? "تم الإزالة من المفضلة" : "تم الإضافة للمفضلة",
      description: `تصنيف "${categoryName}" ${favorites.includes(categoryName) ? "أزيل من" : "أضيف إلى"} المفضلة`,
    })
  }

  const navigateToCategory = (categoryName: string) => {
    router.push(`/category/${encodeURIComponent(categoryName)}`)
  }


  return (
    <div className="space-y-6">
      {/* العنوان والإحصائيات */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">تصنيفات الكتب</h1>
        <p className="text-muted-foreground mb-4">استكشف مكتبتنا المتنوعة من خلال {categories.length} تصنيف مختلف</p>
        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
          <span>📚 {stats.totalBooks} كتاب</span>
          <span>⭐ {stats.averageRating} متوسط التقييم</span>
          <span>❤️ {favorites.length} مفضلة</span>
        </div>
      </div>

      {/* شريط البحث والفلترة */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="ابحث في التصنيفات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">ترتيب أبجدي</SelectItem>
                <SelectItem value="count">عدد الكتب</SelectItem>
                <SelectItem value="rating">التقييم</SelectItem>
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

      {/* عرض التصنيفات */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card
              key={category.name}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
              onClick={() => navigateToCategory(category.name)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                    <Badge className={category.color}>{category.count} كتاب</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(category.name)
                    }}
                    className="p-1 h-8 w-8"
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        category.isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{category.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-yellow-500" />
                    <span>{category.averageRating} ⭐</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <BookOpen className="h-4 w-4" />
                    <span>استكشف</span>
                  </div>
                </div>
              </CardContent>
              {category.isFavorite && (
                <div className="absolute top-2 left-2">
                  <Badge variant="destructive" className="text-xs">
                    مفضلة
                  </Badge>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            {filteredCategories.map((category, index) => (
              <div
                key={category.name}
                className={`flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                  index !== filteredCategories.length - 1 ? "border-b" : ""
                }`}
                onClick={() => navigateToCategory(category.name)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{category.name}</h3>
                      {category.isFavorite && <Heart className="h-4 w-4 fill-red-500 text-red-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  <div className="text-center">
                    <Badge className={category.color}>{category.count}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">كتاب</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{category.averageRating}</span>
                      <TrendingUp className="h-4 w-4 text-yellow-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">تقييم</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(category.name)
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${category.isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                  />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد تصنيفات</h3>
          <p className="text-muted-foreground">لم نجد تصنيفات تطابق بحثك</p>
        </div>
      )}
    </div>
  )
}
