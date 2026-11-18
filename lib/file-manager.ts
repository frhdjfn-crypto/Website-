/**
 * مدير الملفات للكتب
 */

import { formatFileSize, checkFileExists, getFileInfo } from "./download-utils"

export interface BookFile {
  id: string
  bookId: number
  filename: string
  originalName: string
  path: string
  size: number
  type: string
  uploadDate: string
  isActive: boolean
}

export class FileManager {
  private static instance: FileManager
  private files: Map<string, BookFile> = new Map()

  private constructor() {
    this.loadFilesFromStorage()
  }

  static getInstance(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager()
    }
    return FileManager.instance
  }

  /**
   * تحميل قائمة الملفات من localStorage
   */
  private loadFilesFromStorage(): void {
    if (typeof window === "undefined") return

    const stored = localStorage.getItem("bookFiles")
    if (stored) {
      const files = JSON.parse(stored) as BookFile[]
      files.forEach((file) => {
        this.files.set(file.id, file)
      })
    }
  }

  /**
   * حفظ قائمة الملفات في localStorage
   */
  private saveFilesToStorage(): void {
    if (typeof window === "undefined") return

    const files = Array.from(this.files.values())
    localStorage.setItem("bookFiles", JSON.stringify(files))
  }

  /**
   * إضافة ملف جديد
   */
  addFile(bookId: number, file: File, path: string): BookFile {
    const bookFile: BookFile = {
      id: Date.now().toString(),
      bookId,
      filename: file.name,
      originalName: file.name,
      path,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString(),
      isActive: true,
    }

    this.files.set(bookFile.id, bookFile)
    this.saveFilesToStorage()

    return bookFile
  }

  /**
   * الحصول على ملف بواسطة ID
   */
  getFile(id: string): BookFile | undefined {
    return this.files.get(id)
  }

  /**
   * الحصول على ملفات كتاب معين
   */
  getFilesByBookId(bookId: number): BookFile[] {
    return Array.from(this.files.values()).filter((file) => file.bookId === bookId && file.isActive)
  }

  /**
   * الحصول على جميع الملفات
   */
  getAllFiles(): BookFile[] {
    return Array.from(this.files.values()).filter((file) => file.isActive)
  }

  /**
   * حذف ملف
   */
  deleteFile(id: string): boolean {
    const file = this.files.get(id)
    if (file) {
      file.isActive = false
      this.saveFilesToStorage()
      return true
    }
    return false
  }

  /**
   * التحقق من وجود ملف
   */
  async checkFileExists(path: string): Promise<boolean> {
    return await checkFileExists(path)
  }

  /**
   * الحصول على معلومات الملف
   */
  async getFileInfo(path: string) {
    return await getFileInfo(path)
  }

  /**
   * تنسيق حجم الملف
   */
  formatFileSize(bytes: number): string {
    return formatFileSize(bytes)
  }

  /**
   * الحصول على إحصائيات الملفات
   */
  getStats() {
    const files = this.getAllFiles()
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    const typeCount = files.reduce(
      (acc, file) => {
        const ext = file.filename.split(".").pop()?.toLowerCase() || "unknown"
        acc[ext] = (acc[ext] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      totalFiles: files.length,
      totalSize: this.formatFileSize(totalSize),
      typeCount,
      latestUpload: files.length > 0 ? Math.max(...files.map((f) => new Date(f.uploadDate).getTime())) : null,
    }
  }
}

// تصدير instance واحد
export const fileManager = FileManager.getInstance()
