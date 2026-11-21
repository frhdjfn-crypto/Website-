import type { Download } from "@/lib/types"

const HISTORY_KEY = "downloadHistory"

export function getDownloadHistory(): Download[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? "[]") as Download[]
  } catch {
    return []
  }
}

export function addToDownloadHistory(download: Omit<Download, "id">): void {
  if (typeof window === "undefined") return
  const history = getDownloadHistory()
  history.unshift({ ...download, id: `${Date.now()}` })
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)))
}

export function getDownloadStats() {
  const history = getDownloadHistory()
  const totalSize = history.reduce((sum, entry) => sum + (Number.parseFloat(entry.fileSize.replace(" MB", "")) || 0), 0)
  return {
    totalDownloads: history.length,
    totalSize: `${totalSize.toFixed(1)} MB`,
    successRate: history.length ? ((history.filter((entry) => entry.status === "completed").length / history.length) * 100).toFixed(1) : "0",
  }
}
