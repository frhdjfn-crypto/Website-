"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCategories, getBooksByCategory } from "@/lib/books-data"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Heart,
  Brain,
  Clock,
  User,
  Lightbulb,
  Globe,
  Scroll,
  Atom,
  Briefcase,
  Cpu,
  Scale,
  Star,
} from "lucide-react"

export function FeaturedCategories() {
  const router = useRouter()
  const categories = getCategories()

  // أيقونات مخصصة للتصنيفات
  const categoryIcons: Record<string, any> = {
    رواية: BookOpen,
    "تنمية بشرية": Lightbulb,
    تاريخ: Clock,
    "علم نفس": Brain,
    سيرة: User,
    فلسفة: Scroll,
    علوم: Atom,
    أدب: Heart,
    دين: Globe,
    سياسة: Scale,
    اقتصاد: Briefcase,
    تكنولوجيا: Cpu,
  }

  // ألوان مخصصة للتصنيفات
  const categoryColors: Record<string, string> = {
    رواية: "bg-blue-500",
    "تنمية بشرية": "bg-green-500",
    تاريخ: "bg-amber-500",
    "علم نفس": "bg-purple-500",
    سيرة: "bg-orange-500",
    فلسفة: "bg-indigo-500",
    علوم: "bg-cyan-500",
    أدب: "bg-pink-500",
    دين: "bg-emerald-500",
    سياسة: "bg-red-500",
    اقتصاد: "bg-yellow-500",
    تكنولوجيا: "bg-gray-500",
  }

  // حساب التقييمات وترتيب التصنيفات حسب أعلى تقييم
  const allCategoriesWithRatings = categories.map((category) => {
    const books = getBooksByCategory(category)
    const Icon = categoryIcons[category] || BookOpen
    const colorClass = categoryColors[category] || "bg-primary"
    const averageRating = books.reduce((sum, book) => sum + book.rating, 0) / books.length

    return {
      name: category,
      count: books.length,
      icon: Icon,
      colorClass,
      averageRating: Number(averageRating.toFixed(1)),
    }
  })

  // ترتيب التصنيفات حسب التقييم (من الأعلى للأقل) وأخذ أعلى 4
  const topRatedCategories = allCategoriesWithRatings.sort((a, b) => b.averageRating - a.averageRating).slice(0, 4)

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-primary">التصنيفات الأعلى تقييماً</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          اكتشف أفضل التصنيفات الحاصلة على أعلى التقييمات من القراء
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {topRatedCategories.map((category, index) => (
          <Card
            key={category.name}
            className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-background to-muted/30 relative"
            onClick={() => router.push(`/category/${encodeURIComponent(category.name)}`)}
          >
            {/* شارة الترتيب */}
            <div className="absolute top-3 left-3 z-10">
              <Badge
                variant="default"
                className={`text-white font-bold ${
                  index === 0
                    ? "bg-yellow-500"
                    : index === 1
                      ? "bg-gray-400"
                      : index === 2
                        ? "bg-amber-600"
                        : "bg-blue-500"
                }`}
              >
                #{index + 1}
              </Badge>
            </div>

            <CardContent className="p-6 text-center space-y-4">
              <div
                className={`w-16 h-16 ${category.colorClass} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg`}
              >
                <category.icon className="h-8 w-8 text-white" />
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{category.name}</h3>

                {/* عرض التقييم بشكل بارز */}
                <div className="flex items-center justify-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-full px-3 py-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-yellow-600 dark:text-yellow-400">{category.averageRating}</span>
                  <span className="text-sm text-muted-foreground">/ 5</span>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary">{category.count} كتاب</Badge>
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
              >
                استكشف الآن
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" size="lg" onClick={() => router.push("/categories")} className="px-8">
          عرض جميع التصنيفات
        </Button>
      </div>
    </section>
  )
}
