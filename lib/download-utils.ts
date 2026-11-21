export interface DownloadProgress { loaded: number; total: number; percentage: number }
export interface DownloadOptions { onProgress?: (progress: DownloadProgress) => void; onComplete?: () => void; onError?: (error: Error) => void }

export async function downloadFileWithProgress(url: string, filename: string, options: DownloadOptions = {}): Promise<void> {
  try {
    const response = await fetch(url)
    if (response.status === 404) throw new Error("unavailable")
    if (!response.ok) throw new Error("network")
    if (!response.body) throw new Error("network")
    const total = Number(response.headers.get("content-length") ?? 0)
    const reader = response.body.getReader()
    const chunks: Uint8Array[] = []
    let loaded = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) {
        chunks.push(value)
        loaded += value.byteLength
        if (total > 0) options.onProgress?.({ loaded, total, percentage: Math.min(99, Math.floor((loaded / total) * 100)) })
      }
    }
    const blob = new Blob(chunks as BlobPart[])
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = objectUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(objectUrl)
    options.onProgress?.({ loaded, total: total || loaded, percentage: 100 })
    options.onComplete?.()
  } catch (error) {
    const downloadError = error instanceof Error ? error : new Error("network")
    options.onError?.(downloadError)
    if (!options.onError) throw downloadError
  }
}

export async function checkFileExists(url: string): Promise<boolean> {
  try { return (await fetch(url, { method: "HEAD" })).ok } catch { return false }
}
export async function getFileInfo(url: string): Promise<{ exists: boolean; size?: number; type?: string }> {
  try {
    const response = await fetch(url, { method: "HEAD" })
    if (!response.ok) return { exists: false }
    const size = response.headers.get("content-length")
    return { exists: true, size: size ? Number(size) : undefined, type: response.headers.get("content-type") ?? undefined }
  } catch { return { exists: false } }
}
export function formatFileSize(bytes: number): string {
  if (!bytes) return "0 Bytes"
  const units = ["Bytes", "KB", "MB", "GB"]
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${Number((bytes / 1024 ** index).toFixed(2))} ${units[index]}`
}
export function getFileExtension(filename: string): string { return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2) }
export function isValidBookFile(filename: string): boolean { return ["pdf", "epub", "mobi", "txt", "doc", "docx"].includes(getFileExtension(filename).toLowerCase()) }
