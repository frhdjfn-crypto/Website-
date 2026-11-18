"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { imageManager, type BookImage } from "@/lib/image-manager"
import { ImageUpload } from "@/components/image-upload"
import { ImageIcon, Trash2, Eye, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

interface BookImageGalleryProps {
  bookId: number
  bookTitle: string
  currentImageUrl?: string
  onImageChange?: (imageUrl: string) => void
}

export function BookImageGallery({ bookId, bookTitle, currentImageUrl, onImageChange }: BookImageGalleryProps) {
  const [images, setImages] = useState<BookImage[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadImages()
  }, [bookId])

  const loadImages = () => {
    const bookImages = imageManager.getBookImages(bookId)
    setImages(bookImages)
  }

  const handleImageAdded = (imageUrl: string) => {
    loadImages()
    setShowUpload(false)
    if (onImageChange) {
      onImageChange(imageUrl)
    }
  }

  const handleDeleteImage = (imageId: number) => {
    const success = imageManager.deleteImage(imageId)
    if (success) {
      loadImages()
      toast({
        title: "تم حذف الصورة",
        description: "تم حذف الصورة بنجاح",
      })
    }
  }

  const handleSelectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    if (onImageChange) {
      onImageChange(imageUrl)
    }
    toast({
      title: "تم تحديد الصورة",
      description: "تم تحديد هذه الصورة كغلاف للكتاب",
    })
  }

  return (
    <div className="space-y-6">
      {/* عرض الصور الحالية */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              صور الكتاب ({images.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-[3/4] relative bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={`صورة ${bookTitle}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />

                    {/* شارة نوع الصورة */}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {image.type === "cover" ? "غلاف" : "صورة"}
                      </Badge>
                    </div>

                    {/* أزرار التحكم */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSelectImage(image.url)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* مؤشر الصورة المحددة */}
                    {(selectedImage === image.url || currentImageUrl === image.url) && (
                      <div className="absolute inset-0 border-4 border-primary rounded-lg"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* زر إضافة صورة جديدة */}
      {!showUpload && (
        <div className="text-center">
          <Button onClick={() => setShowUpload(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            إضافة صورة جديدة
          </Button>
        </div>
      )}

      {/* نموذج رفع الصورة */}
      {showUpload && <ImageUpload bookId={bookId} bookTitle={bookTitle} onImageAdded={handleImageAdded} />}
    </div>
  )
}
