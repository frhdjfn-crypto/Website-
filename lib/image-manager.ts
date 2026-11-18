/**
 * مدير الصور - لإدارة صور أغلفة الكتب
 */

export interface BookImage {
  id: number
  bookId: number
  url: string
  localPath?: string
  type: "cover" | "thumbnail" | "preview"
  width?: number
  height?: number
  size?: number
  uploadDate: string
  isActive: boolean
}

export class ImageManager {
  private static instance: ImageManager
  private images: Map<number, BookImage[]> = new Map()

  private constructor() {
    this.loadImagesFromStorage()
    // إضافة صورة كتاب التوحيد
    this.addImage(31, "/images/covers/kitab-tawheed.webp", "cover")
  }

  static getInstance(): ImageManager {
    if (!ImageManager.instance) {
      ImageManager.instance = new ImageManager()
    }
    return ImageManager.instance
  }

  /**
   * تحميل قائمة الصور من localStorage
   */
  private loadImagesFromStorage(): void {
    if (typeof window === "undefined") return

    const stored = localStorage.getItem("bookImages")
    if (stored) {
      const images = JSON.parse(stored) as BookImage[]
      images.forEach((image) => {
        const bookImages = this.images.get(image.bookId) || []
        bookImages.push(image)
        this.images.set(image.bookId, bookImages)
      })
    }
  }

  /**
   * حفظ قائمة الصور في localStorage
   */
  private saveImagesToStorage(): void {
    if (typeof window === "undefined") return

    const allImages: BookImage[] = []
    this.images.forEach((images) => {
      allImages.push(...images)
    })
    localStorage.setItem("bookImages", JSON.stringify(allImages))
  }

  /**
   * إضافة صورة جديدة
   */
  addImage(bookId: number, url: string, type: BookImage["type"] = "cover", localPath?: string): BookImage {
    const image: BookImage = {
      id: Date.now(),
      bookId,
      url,
      localPath,
      type,
      uploadDate: new Date().toISOString(),
      isActive: true,
    }

    const bookImages = this.images.get(bookId) || []
    bookImages.push(image)
    this.images.set(bookId, bookImages)
    this.saveImagesToStorage()

    return image
  }

  /**
   * الحصول على صور كتاب معين
   */
  getBookImages(bookId: number): BookImage[] {
    return this.images.get(bookId)?.filter((img) => img.isActive) || []
  }

  /**
   * الحصول على صورة الغلاف الرئيسية
   */
  getBookCover(bookId: number): BookImage | null {
    const images = this.getBookImages(bookId)
    return images.find((img) => img.type === "cover") || images[0] || null
  }

  /**
   * تحديث صورة
   */
  updateImage(imageId: number, updates: Partial<BookImage>): boolean {
    for (const [bookId, images] of this.images) {
      const imageIndex = images.findIndex((img) => img.id === imageId)
      if (imageIndex !== -1) {
        images[imageIndex] = { ...images[imageIndex], ...updates }
        this.saveImagesToStorage()
        return true
      }
    }
    return false
  }

  /**
   * حذف صورة
   */
  deleteImage(imageId: number): boolean {
    for (const [bookId, images] of this.images) {
      const imageIndex = images.findIndex((img) => img.id === imageId)
      if (imageIndex !== -1) {
        images[imageIndex].isActive = false
        this.saveImagesToStorage()
        return true
      }
    }
    return false
  }

  /**
   * التحقق من وجود صورة
   */
  async checkImageExists(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: "HEAD" })
      return response.ok
    } catch {
      return false
    }
  }

  /**
   * رفع صورة محلية
   */
  async uploadLocalImage(file: File, bookId: number): Promise<string> {
    // في التطبيق الحقيقي، ستقوم برفع الصورة إلى الخادم
    // هنا نستخدم URL.createObjectURL للمعاينة المحلية
    const url = URL.createObjectURL(file)

    // إضافة الصورة إلى قاعدة البيانات المحلية
    this.addImage(bookId, url, "cover", `/images/covers/${file.name}`)

    return url
  }

  /**
   * الحصول على إحصائيات الصور
   */
  getStats() {
    let totalImages = 0
    let totalSize = 0
    const typeCount: Record<string, number> = {}

    this.images.forEach((images) => {
      images.forEach((image) => {
        if (image.isActive) {
          totalImages++
          totalSize += image.size || 0
          typeCount[image.type] = (typeCount[image.type] || 0) + 1
        }
      })
    })

    return {
      totalImages,
      totalSize,
      typeCount,
      booksWithImages: this.images.size,
    }
  }
}

// تصدير instance واحد
export const imageManager = ImageManager.getInstance()
