/**
 * أدوات مساعدة للتحميل
 */

export interface DownloadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface DownloadOptions {
  onProgress?: (progress: DownloadProgress) => void
  onComplete?: () => void
  onError?: (error: Error) => void
}

/**
 * تحميل ملف مع تتبع التقدم
 */
export async function downloadFileWithProgress(
  url: string,
  filename: string,
  options: DownloadOptions = {},
): Promise<void> {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const contentLength = response.headers.get("content-length")
    const total = contentLength ? Number.parseInt(contentLength, 10) : 0

    if (!response.body) {
      throw new Error("Response body is null")
    }

    const reader = response.body.getReader()
    const chunks: BlobPart[] = []
    let loaded = 0

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      if (value) {
        const chunk = new Uint8Array(value.byteLength)
        chunk.set(value)
        chunks.push(chunk.buffer)
        loaded += value.length

        if (options.onProgress && total > 0) {
          options.onProgress({
            loaded,
            total,
            percentage: Math.round((loaded / total) * 100),
          })
        }
      }
    }

    // إنشاء blob من البيانات
    const blob = new Blob(chunks)

    // إنشاء رابط التحميل
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = filename

    // تشغيل التحميل
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // تنظيف الذاكرة
    window.URL.revokeObjectURL(downloadUrl)

    if (options.onComplete) {
      options.onComplete()
    }
  } catch (error) {
    if (options.onError) {
      options.onError(error as Error)
    } else {
      throw error
    }
  }
}

/**
 * التحقق من وجود ملف
 */
export async function checkFileExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.ok
  } catch {
    return false
  }
}

/**
 * الحصول على معلومات الملف
 */
export async function getFileInfo(url: string): Promise<{
  exists: boolean
  size?: number
  type?: string
}> {
  try {
    const response = await fetch(url, { method: "HEAD" })

    if (!response.ok) {
      return { exists: false }
    }

    const size = response.headers.get("content-length")
    const type = response.headers.get("content-type")

    return {
      exists: true,
      size: size ? Number.parseInt(size, 10) : undefined,
      type: type || undefined,
    }
  } catch {
    return { exists: false }
  }
}

/**
 * تنسيق حجم الملف
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * الحصول على امتداد الملف
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
}

/**
 * التحقق من صحة نوع الملف
 */
export function isValidBookFile(filename: string): boolean {
  const validExtensions = ["pdf", "epub", "mobi", "txt", "doc", "docx"]
  const extension = getFileExtension(filename).toLowerCase()
  return validExtensions.includes(extension)
}
