"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Upload, ImageIcon, X, Eye } from "lucide-react"
import { imageManager } from "@/lib/image-manager"
import Image from "next/image"

interface ImageUploadProps {
  bookId: number
  bookTitle: string
  onImageAdded?: (imageUrl: string) => void
}

export function ImageUpload({ bookId, bookTitle, onImageAdded }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    // التحقق من نوع الملف
    if (!file.type.startsWith("image/")) {
      toast({
        title: "نوع ملف غير صحيح",
        description: "يرجى اختيار ملف صورة (JPG, PNG, GIF, WebP)",
        variant: "destructive",
      })
      return
    }

    // التحقق من حجم الملف (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "حجم الملف كبير جداً",
        description: "يرجى اختيار صورة أصغر من 5 ميجابايت",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)

      // رفع الصورة
      const uploadedUrl = await imageManager.uploadLocalImage(file, bookId)
      setPreviewUrl(uploadedUrl)

      toast({
        title: "تم رفع الصورة بنجاح",
        description: `تم رفع صورة غلاف "${bookTitle}" بنجاح`,
      })

      if (onImageAdded) {
        onImageAdded(uploadedUrl)
      }
    } catch (error) {
      toast({
        title: "خطأ في رفع الصورة",
        description: "حدث خطأ أثناء رفع الصورة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!imageUrl.trim()) {
      toast({
        title: "رابط فارغ",
        description: "يرجى إدخال رابط الصورة",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)

      // التحقق من صحة الرابط
      const exists = await imageManager.checkImageExists(imageUrl)
      if (!exists) {
        toast({
          title: "رابط غير صحيح",
          description: "لا يمكن الوصول إلى الصورة من هذا الرابط",
          variant: "destructive",
        })
        return
      }

      // إضافة الصورة
      imageManager.addImage(bookId, imageUrl, "cover")
      setPreviewUrl(imageUrl)
      setImageUrl("")

      toast({
        title: "تم إضافة الصورة بنجاح",
        description: `تم إضافة صورة غلاف "${bookTitle}" من الرابط`,
      })

      if (onImageAdded) {
        onImageAdded(imageUrl)
      }
    } catch (error) {
      toast({
        title: "خطأ في إضافة الصورة",
        description: "حدث خطأ أثناء إضافة الصورة من الرابط",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const clearPreview = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          إضافة صورة غلاف للكتاب
        </CardTitle>
        <p className="text-sm text-muted-foreground">أضف صورة غلاف لكتاب "{bookTitle}"</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">رفع ملف</TabsTrigger>
            <TabsTrigger value="url">رابط صورة</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />

              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium">اسحب الصورة هنا أو انقر للاختيار</p>
                  <p className="text-sm text-gray-500 mt-1">الأنواع المدعومة: JPG, PNG, GIF, WebP (حتى 5 ميجابايت)</p>
                </div>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" disabled={uploading}>
                  {uploading ? "جاري الرفع..." : "اختيار صورة"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">رابط الصورة</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={uploading}
                />
              </div>
              <Button type="submit" disabled={uploading || !imageUrl.trim()}>
                {uploading ? "جاري الإضافة..." : "إضافة الصورة"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* معاينة الصورة */}
        {previewUrl && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                معاينة الصورة
              </h4>
              <Button variant="outline" size="sm" onClick={clearPreview}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative w-full max-w-xs mx-auto">
              <div className="aspect-[3/4] relative bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={previewUrl || "/placeholder.svg"}
                  alt={`غلاف كتاب ${bookTitle}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
