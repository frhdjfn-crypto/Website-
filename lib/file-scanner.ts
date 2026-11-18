/**
 * ماسح الملفات - لفحص مجلد الكتب والعثور على الملفات الجديدة
 */

export interface ScannedFile {
  name: string
  path: string
  size?: number
  lastModified?: number
  type: string
  isNew: boolean
}

export interface BookFileInfo {
  id: number
  title: string
  author: string
  filePath: string
  fileName: string
  fileSize: string
  format: string
  addedDate: string
  isAvailable: boolean
  lastChecked: string
}

export class FileScanner {
  private static instance: FileScanner
  private knownFiles: Map<string, BookFileInfo> = new Map()
  private readonly BOOKS_PATH = "/books"

  private constructor() {
    this.loadKnownFiles()
  }

  static getInstance(): FileScanner {
    if (!FileScanner.instance) {
      FileScanner.instance = new FileScanner()
    }
    return FileScanner.instance
  }

  /**
   * تحميل قائمة الملفات المعروفة من localStorage
   */
  private loadKnownFiles(): void {
    if (typeof window === "undefined") return

    const stored = localStorage.getItem("knownBookFiles")
    if (stored) {
      const files = JSON.parse(stored) as BookFileInfo[]
      files.forEach((file) => {
        this.knownFiles.set(file.filePath, file)
      })
    }
  }

  /**
   * حفظ قائمة الملفات المعروفة في localStorage
   */
  private saveKnownFiles(): void {
    if (typeof window === "undefined") return

    const files = Array.from(this.knownFiles.values())
    localStorage.setItem("knownBookFiles", JSON.stringify(files))
  }

  /**
   * فحص ملف واحد للتأكد من وجوده
   */
  async checkFileExists(filePath: string): Promise<boolean> {
    try {
      const response = await fetch(filePath, { method: "HEAD" })
      return response.ok
    } catch {
      return false
    }
  }

  /**
   * الحصول على معلومات الملف
   */
  async getFileInfo(filePath: string): Promise<{
    exists: boolean
    size?: number
    lastModified?: number
    type?: string
  }> {
    try {
      const response = await fetch(filePath, { method: "HEAD" })

      if (!response.ok) {
        return { exists: false }
      }

      const size = response.headers.get("content-length")
      const lastModified = response.headers.get("last-modified")
      const type = response.headers.get("content-type")

      return {
        exists: true,
        size: size ? Number.parseInt(size, 10) : undefined,
        lastModified: lastModified ? new Date(lastModified).getTime() : undefined,
        type: type || undefined,
      }
    } catch {
      return { exists: false }
    }
  }

  /**
   * تسجيل ملف جديد
   */
  registerFile(bookId: number, title: string, author: string, filePath: string): BookFileInfo {
    const fileName = filePath.split("/").pop() || ""
    const format = fileName.split(".").pop()?.toUpperCase() || "PDF"

    const fileInfo: BookFileInfo = {
      id: bookId,
      title,
      author,
      filePath,
      fileName,
      fileSize: "0 MB", // سيتم تحديثه عند الفحص
      format,
      addedDate: new Date().toISOString(),
      isAvailable: false, // سيتم تحديثه عند الفحص
      lastChecked: new Date().toISOString(),
    }

    this.knownFiles.set(filePath, fileInfo)
    this.saveKnownFiles()

    return fileInfo
  }

  /**
   * فحص جميع الملفات المسجلة
   */
  async scanAllFiles(): Promise<BookFileInfo[]> {
    const results: BookFileInfo[] = []

    for (const [filePath, fileInfo] of this.knownFiles) {
      const info = await this.getFileInfo(filePath)

      const updatedFileInfo: BookFileInfo = {
        ...fileInfo,
        isAvailable: info.exists,
        fileSize: info.size ? this.formatFileSize(info.size) : fileInfo.fileSize,
        lastChecked: new Date().toISOString(),
      }

      this.knownFiles.set(filePath, updatedFileInfo)
      results.push(updatedFileInfo)
    }

    this.saveKnownFiles()
    return results
  }

  /**
   * الحصول على الملفات الجديدة (المضافة في آخر 30 يوم)
   */
  getRecentFiles(days = 30): BookFileInfo[] {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return Array.from(this.knownFiles.values())
      .filter((file) => {
        const addedDate = new Date(file.addedDate)
        return addedDate >= cutoffDate && file.isAvailable
      })
      .sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
  }

  /**
   * الحصول على الملفات المتاحة
   */
  getAvailableFiles(): BookFileInfo[] {
    return Array.from(this.knownFiles.values())
      .filter((file) => file.isAvailable)
      .sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
  }

  /**
   * الحصول على الملفات غير المتاحة
   */
  getUnavailableFiles(): BookFileInfo[] {
    return Array.from(this.knownFiles.values()).filter((file) => !file.isAvailable)
  }

  /**
   * تنسيق حجم الملف
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 MB"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  /**
   * حذف ملف من القائمة
   */
  removeFile(filePath: string): boolean {
    const deleted = this.knownFiles.delete(filePath)
    if (deleted) {
      this.saveKnownFiles()
    }
    return deleted
  }

  /**
   * الحصول على إحصائيات الملفات
   */
  getStats() {
    const allFiles = Array.from(this.knownFiles.values())
    const availableFiles = allFiles.filter((f) => f.isAvailable)
    const recentFiles = this.getRecentFiles(7) // آخر أسبوع

    return {
      total: allFiles.length,
      available: availableFiles.length,
      unavailable: allFiles.length - availableFiles.length,
      recentlyAdded: recentFiles.length,
      formats: this.getFormatStats(availableFiles),
    }
  }

  /**
   * إحصائيات أنواع الملفات
   */
  private getFormatStats(files: BookFileInfo[]) {
    return files.reduce(
      (acc, file) => {
        acc[file.format] = (acc[file.format] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }
}

// تصدير instance واحد
export const fileScanner = FileScanner.getInstance()
