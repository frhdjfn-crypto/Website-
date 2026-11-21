"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { addToDownloadHistory } from "@/lib/download-history"
import { downloadFileWithProgress } from "@/lib/download-utils"
import { Download, CheckCircle, FileDown, Loader2 } from "lucide-react"
import type { Book } from "@/lib/types"

interface DownloadManagerProps { book: Book; variant?: "button" | "card"; size?: "sm" | "default" | "lg" }

export function DownloadManager({ book, variant = "button", size = "default" }: DownloadManagerProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const { toast } = useToast()

  const handleDownload = useCallback(async () => {
    if (!book.downloadUrl) return
    if (isDownloading || downloadComplete) return
    setIsDownloading(true)
    setProgress(0)
    try {
      await downloadFileWithProgress(`/api/download/${book.id}`, `${book.title}.pdf`, {
        onProgress: ({ percentage }) => setProgress(percentage),
        onComplete: () => {
          addToDownloadHistory({ bookId: book.id, bookTitle: book.title, author: book.author, downloadDate: new Date().toISOString(), fileSize: book.fileSize || "غير محدد", format: book.format || "PDF", status: "completed" })
          setDownloadComplete(true)
          toast({ title: "تم التحميل بنجاح" })
          window.setTimeout(() => setDownloadComplete(false), 3000)
        },
        onError: (error) => {
          const unavailable = error.message === "unavailable"
          addToDownloadHistory({ bookId: book.id, bookTitle: book.title, author: book.author, downloadDate: new Date().toISOString(), fileSize: book.fileSize || "غير محدد", format: book.format || "PDF", status: "failed" })
          toast({ title: unavailable ? "الملف غير متوفر حالياً" : "حدث خطأ في الشبكة", variant: "destructive" })
        },
      })
    } finally {
      setIsDownloading(false)
    }
  }, [book, downloadComplete, isDownloading, toast])

  const disabled = !book.downloadUrl || isDownloading || downloadComplete
  const buttonContent = isDownloading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{Math.round(progress)}%</> : downloadComplete ? <><CheckCircle className="mr-2 h-4 w-4 text-green-600" />تم</> : !book.downloadUrl ? "غير متوفر" : <><Download className="mr-2 h-4 w-4" />تحميل PDF</>

  if (variant === "card") return (
    <Card className="w-full">
      <CardHeader><CardTitle className="flex items-center gap-2"><FileDown className="h-5 w-5" />تحميل الكتاب</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm"><span>الحجم: {book.fileSize || "غير محدد"}</span><span>الصيغة: {book.format || "PDF"}</span></div>
        <div className="flex justify-between text-sm"><span>التحميلات: {book.downloadCount?.toLocaleString()}</span><span className="text-green-600">مجاني</span></div>
        {isDownloading && <div className="space-y-2"><div className="flex justify-between text-sm"><span>جاري التحميل...</span><span>{progress}%</span></div><Progress value={progress} className="h-2" /></div>}
        <Button onClick={handleDownload} disabled={disabled} className="w-full" size={size}>{buttonContent}</Button>
      </CardContent>
    </Card>
  )

  return <Button onClick={handleDownload} disabled={disabled} variant="outline" size={size} className="relative">{buttonContent}{isDownloading && <span className="absolute bottom-0 left-0 h-1 bg-primary transition-all" style={{ width: `${progress}%` }} />}</Button>
}
