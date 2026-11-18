"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  BookIcon,
  Star,
  StarHalf,
  FolderOpen,
  User,
  Calendar,
  Plus,
  MessageSquare,
  ArrowRight,
  Eye,
  Heart,
  Share2,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import type { Book } from "@/lib/types"
import { DownloadManager } from "@/components/download-manager"
import Image from "next/image"

interface BookDetailProps {
  book: Book
}

export function BookDetail({ book }: BookDetailProps) {
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState(book.comments)
  const [isLiked, setIsLiked] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { toast } = useToast()
  const { user, addToLibrary } = useAuth()
  const router = useRouter()

  const handleAddToLibrary = () => {
    addToLibrary(book.title)
    toast({
      title: "تمت الإضافة بنجاح",
      description: `تمت إضافة "${book.title}" إلى مكتبتك`,
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: book.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "تم النسخ",
        description: "تم نسخ رابط الكتاب إلى الحافظة",
      })
    }
  }

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment = {
        text: commentText,
        author: user?.name || "زائر",
        date: new Date().toLocaleDateString("ar-SA"),
      }
      setComments([...comments, newComment])
      setCommentText("")
      toast({
        title: "تم إضافة تعليقك",
        description: "تم إضافة تعليقك بنجاح!",
      })
    } else {
      toast({
        title: "خطأ",
        description: "الرجاء كتابة تعليق قبل الإرسال",
        variant: "destructive",
      })
    }
  }

  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-5 w-5 fill-yellow-400 text-yellow-400" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="h-5 w-5 text-yellow-400" />
        ))}
        <span className="mr-2 text-lg font-medium">({rating})</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* زر العودة */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 flex items-center gap-2 hover:bg-muted">
        <ArrowRight className="h-4 w-4" />
        العودة للصفحة الرئيسية
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* غلاف الكتاب */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <div className="relative aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary-dark/10">
              {book.imageUrl && !imageError ? (
                <Image
                  src={book.imageUrl || "/placeholder.svg"}
                  alt={`غلاف كتاب ${book.title}`}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white">
                  <BookIcon className="h-24 w-24 opacity-90" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                <Button onClick={handleAddToLibrary} className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> أضف إلى مكتبتي
                </Button>
                <DownloadManager book={book} variant="card" />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className={isLiked ? "text-red-500 border-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* تفاصيل الكتاب */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-primary">{book.title}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {book.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {book.year}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  {renderRating(book.rating)}
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <FolderOpen className="h-3 w-3" />
                    {book.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* وصف الكتاب */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">نبذة عن الكتاب</h3>
                  <p className="text-muted-foreground leading-relaxed">{book.description}</p>
                </div>

                <Separator />

                {/* معلومات إضافية */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">معلومات الكتاب</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="font-medium">المؤلف:</span>
                      <span>{book.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">سنة النشر:</span>
                      <span>{book.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">التصنيف:</span>
                      <span>{book.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">التقييم:</span>
                      <span>{book.rating}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">عدد الصفحات:</span>
                      <span>{book.pages || "غير محدد"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">اللغة:</span>
                      <span>{book.language || "العربية"}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* قسم التعليقات */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    التعليقات ({comments.length})
                  </h3>

                  {/* إضافة تعليق جديد */}
                  <div className="mb-6 space-y-3">
                    <Textarea
                      placeholder="شاركنا رأيك في هذا الكتاب..."
                      className="min-h-[100px]"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button onClick={handleAddComment}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      إضافة تعليق
                    </Button>
                  </div>

                  {/* عرض التعليقات */}
                  <div className="space-y-4">
                    {comments.map((comment, index) => (
                      <Card key={index} className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-sm text-muted-foreground">{comment.date || "اليوم"}</span>
                          </div>
                          <p className="text-muted-foreground">{comment.text}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
