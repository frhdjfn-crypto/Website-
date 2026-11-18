"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Plus } from "lucide-react"
import type { Book } from "@/lib/types"

interface AddBookFormProps {
  onAddBook: (book: Omit<Book, "id">) => void
}

export function AddBookForm({ onAddBook }: AddBookFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    rating: 0,
    year: new Date().getFullYear(),
    pages: 0,
    language: "العربية",
    description: "",
  })

  const { toast } = useToast()

  const categories = [
    "رواية",
    "تنمية بشرية",
    "تاريخ",
    "علم نفس",
    "سيرة",
    "فلسفة",
    "علوم",
    "أدب",
    "دين",
    "سياسة",
    "اقتصاد",
    "تكنولوجيا",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.author || !formData.category || !formData.description) {
      toast({
        title: "خطأ",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    const newBook: Omit<Book, "id"> = {
      ...formData,
      comments: [],
    }

    onAddBook(newBook)

    toast({
      title: "تم إضافة الكتاب",
      description: `تم إضافة "${formData.title}" بنجاح`,
    })

    // إعادة تعيين النموذج
    setFormData({
      title: "",
      author: "",
      category: "",
      rating: 0,
      year: new Date().getFullYear(),
      pages: 0,
      language: "العربية",
      description: "",
    })
    setIsOpen(false)
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!isOpen) {
    return (
      <div className="mb-6">
        <Button onClick={() => setIsOpen(true)} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          إضافة كتاب جديد
        </Button>
      </div>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          إضافة كتاب جديد
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">عنوان الكتاب *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="أدخل عنوان الكتاب"
                required
              />
            </div>

            <div>
              <Label htmlFor="author">المؤلف *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                placeholder="أدخل اسم المؤلف"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">التصنيف *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="year">سنة النشر</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange("year", Number.parseInt(e.target.value))}
                placeholder="2024"
                min="1000"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <Label htmlFor="pages">عدد الصفحات</Label>
              <Input
                id="pages"
                type="number"
                value={formData.pages}
                onChange={(e) => handleInputChange("pages", Number.parseInt(e.target.value))}
                placeholder="300"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating">التقييم (من 1 إلى 5)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                value={formData.rating}
                onChange={(e) => handleInputChange("rating", Number.parseFloat(e.target.value))}
                placeholder="4.5"
                min="1"
                max="5"
              />
            </div>

            <div>
              <Label htmlFor="language">اللغة</Label>
              <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="العربية">العربية</SelectItem>
                  <SelectItem value="الإنجليزية">الإنجليزية</SelectItem>
                  <SelectItem value="الفرنسية">الفرنسية</SelectItem>
                  <SelectItem value="الألمانية">الألمانية</SelectItem>
                  <SelectItem value="الإسبانية">الإسبانية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">وصف الكتاب *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="أدخل وصفاً مفصلاً للكتاب..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit">إضافة الكتاب</Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              إلغاء
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
