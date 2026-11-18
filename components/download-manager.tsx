"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { addToDownloadHistory } from "@/lib/books-data"
import { Download, CheckCircle, FileDown, Loader2 } from "lucide-react"
import type { Book } from "@/lib/types"

interface DownloadManagerProps {
  book: Book
  variant?: "button" | "card"
  size?: "sm" | "default" | "lg"
}

export function DownloadManager({ book, variant = "button", size = "default" }: DownloadManagerProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const { toast } = useToast()

  const handleDownload = useCallback(async () => {
    if (!book.downloadUrl) {
      toast({
        title: "خطأ في التحميل",
        description: "رابط التحميل غير متوفر لهذا الكتاب",
        variant: "destructive",
      })
      return
    }

    if (isDownloading || downloadComplete) {
      return
    }

    setIsDownloading(true)
    setProgress(0)
    setDownloadComplete(false)

    try {
      // محاكاة عملية التحميل مع شريط التقدم
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsDownloading(false)
            setDownloadComplete(true)

            // إضافة إلى تاريخ التحميلات
            addToDownloadHistory({
              bookId: book.id,
              bookTitle: book.title,
              author: book.author,
              downloadDate: new Date().toISOString(),
              fileSize: book.fileSize || "غير محدد",
              format: book.format || "PDF",
              status: "completed",
            })

            // عرض رسالة النجاح
            setTimeout(() => {
              toast({
                title: "تم التحميل بنجاح",
                description: `تم تحميل "${book.title}" بنجاح`,
              })
            }, 100)

            // إخفاء رسالة الإكمال بعد 3 ثوان
            setTimeout(() => setDownloadComplete(false), 3000)

            return 100
          }
          return prev + Math.random() * 15 + 5
        })
      }, 200)

      // في التطبيق الحقيقي، ستقوم بتحميل الملف الفعلي
      // const response = await fetch(book.downloadUrl)
      // const blob = await response.blob()
      // const url = window.URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = `${book.title}.pdf`
      // document.body.appendChild(a)
      // a.click()
      // window.URL.revokeObjectURL(url)
      // document.body.removeChild(a)
    } catch (error) {
      setIsDownloading(false)
      setProgress(0)

      addToDownloadHistory({
        bookId: book.id,
        bookTitle: book.title,
        author: book.author,
        downloadDate: new Date().toISOString(),
        fileSize: book.fileSize || "غير محدد",
        format: book.format || "PDF",
        status: "failed",
      })

      // عرض رسالة الخطأ
      setTimeout(() => {
        toast({
          title: "فشل في التحميل",
          description: "حدث خطأ أثناء تحميل الكتاب، يرجى المحاولة مرة أخرى",
          variant: "destructive",
        })
      }, 100)
    }
  }, [book, isDownloading, downloadComplete, toast])

  if (variant === "card") {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            تحميل الكتاب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>الحجم: {book.fileSize}</span>
            <span>الصيغة: {book.format}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>التحميلات: {book.downloadCount?.toLocaleString()}</span>
            <span className="text-green-600">مجاني</span>
          </div>

          {isDownloading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>جاري التحميل...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <Button onClick={handleDownload} disabled={isDownloading || downloadComplete} className="w-full" size={size}>
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري التحميل...
              </>
            ) : downloadComplete ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                تم التحميل
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                تحميل PDF
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading || downloadComplete}
      variant="outline"
      size={size}
      className="relative"
    >
      {isDownloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {Math.round(progress)}%
        </>
      ) : downloadComplete ? (
        <>
          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
          تم
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          تحميل
        </>
      )}

      {isDownloading && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      )}
    </Button>
  )
}
