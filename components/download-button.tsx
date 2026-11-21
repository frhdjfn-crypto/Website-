"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Download, Loader2 } from "lucide-react"
import { addToDownloadHistory } from "@/lib/download-history"
import { downloadFileWithProgress } from "@/lib/download-utils"
import type { Book } from "@/lib/types"

interface DownloadButtonProps { book: Book; variant?: "default" | "outline" | "secondary"; size?: "default" | "sm" | "lg" }

export function DownloadButton({ book, variant = "default", size = "default" }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const handleDownload = async () => {
    if (!book.downloadUrl || isDownloading) return
    setIsDownloading(true)
    try {
      await downloadFileWithProgress(`/api/download/${book.id}`, `${book.title}.pdf`, {
        onComplete: () => {
          addToDownloadHistory({ bookId: book.id, bookTitle: book.title, author: book.author, downloadDate: new Date().toISOString(), fileSize: book.fileSize || "غير محدد", format: book.format || "PDF", status: "completed" })
          toast({ title: "تم التحميل بنجاح" })
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
  }

  return <Button onClick={handleDownload} disabled={!book.downloadUrl || isDownloading} variant={variant} size={size} className="w-full">
    {isDownloading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />جاري التحميل...</> : !book.downloadUrl ? "غير متوفر" : <><Download className="mr-2 h-4 w-4" />تحميل ({book.fileSize})</>}
  </Button>
}
