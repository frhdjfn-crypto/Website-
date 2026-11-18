"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Download, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { downloadBook, checkFileExists } from "@/lib/books-data"
import type { Book } from "@/lib/types"

interface DownloadButtonProps {
  book: Book
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
}

export function DownloadButton({ book, variant = "default", size = "default" }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle")
  const { toast } = useToast()

  const handleDownload = async () => {
    if (!book.downloadUrl) {
      toast({
        title: "خطأ",
        description: "رابط التحميل غير متوفر",
        variant: "destructive",
      })
      return
    }

    setIsDownloading(true)
    setDownloadStatus("checking")

    try {
      // التحقق من وجود الملف
      const fileExists = await checkFileExists(book.downloadUrl)

      if (!fileExists) {
        setDownloadStatus("unavailable")
        toast({
          title: "الملف غير متوفر",
          description: "عذراً، هذا الكتاب غير متوفر للتحميل حالياً",
          variant: "destructive",
        })
        return
      }

      setDownloadStatus("available")

      // بدء التحميل
      downloadBook(book)

      toast({
        title: "تم بدء التحميل",
        description: `جاري تحميل "${book.title}"`,
      })

      // محاكاة وقت التحميل
      setTimeout(() => {
        toast({
          title: "تم التحميل بنجاح",
          description: `تم تحميل "${book.title}" بنجاح`,
        })
        setIsDownloading(false)
        setDownloadStatus("idle")
      }, 2000)
    } catch (error) {
      setDownloadStatus("unavailable")
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء محاولة تحميل الكتاب",
        variant: "destructive",
      })
      setIsDownloading(false)
    }
  }

  const getButtonContent = () => {
    if (isDownloading) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          جاري التحميل...
        </>
      )
    }

    if (downloadStatus === "checking") {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          جاري التحقق...
        </>
      )
    }

    if (downloadStatus === "unavailable") {
      return (
        <>
          <AlertCircle className="mr-2 h-4 w-4" />
          غير متوفر
        </>
      )
    }

    if (downloadStatus === "available") {
      return (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          متوفر للتحميل
        </>
      )
    }

    return (
      <>
        <Download className="mr-2 h-4 w-4" />
        تحميل ({book.fileSize})
      </>
    )
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading || downloadStatus === "unavailable"}
      variant={variant}
      size={size}
      className="w-full"
    >
      {getButtonContent()}
    </Button>
  )
}
