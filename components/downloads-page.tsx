"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getDownloadHistory, getDownloadStats, getBookById } from "@/lib/books-data"
import {
  Download,
  Search,
  Filter,
  Trash2,
  FileDown,
  Calendar,
  HardDrive,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Download as DownloadType } from "@/lib/types"

export function DownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadType[]>([])
  const [filteredDownloads, setFilteredDownloads] = useState<DownloadType[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const { toast } = useToast()

  useEffect(() => {
    loadDownloads()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [downloads, searchQuery, filterBy, sortBy])

  const loadDownloads = () => {
    const history = getDownloadHistory()
    setDownloads(history)
  }

  const applyFilters = () => {
    let filtered = downloads

    // البحث
    if (searchQuery) {
      filtered = filtered.filter(
        (download) =>
          download.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          download.author.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // الفلترة حسب الحالة
    if (filterBy !== "all") {
      filtered = filtered.filter((download) => download.status === filterBy)
    }

    // الترتيب
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.downloadDate).getTime() - new Date(a.downloadDate).getTime()
        case "title":
          return a.bookTitle.localeCompare(b.bookTitle)
        case "author":
          return a.author.localeCompare(b.author)
        case "size":
          const sizeA = Number.parseFloat(a.fileSize.replace(" MB", ""))
          const sizeB = Number.parseFloat(b.fileSize.replace(" MB", ""))
          return sizeB - sizeA
        default:
          return 0
      }
    })

    setFilteredDownloads(filtered)
  }

  const clearHistory = () => {
    localStorage.removeItem("downloadHistory")
    setDownloads([])
    toast({
      title: "تم مسح السجل",
      description: "تم مسح سجل التحميلات بنجاح",
    })
  }

  const removeDownload = (id: string) => {
    const updatedDownloads = downloads.filter((d) => d.id !== id)
    setDownloads(updatedDownloads)
    localStorage.setItem("downloadHistory", JSON.stringify(updatedDownloads))
    toast({
      title: "تم الحذف",
      description: "تم حذف العنصر من سجل التحميلات",
    })
  }

  const redownload = (download: DownloadType) => {
    const book = getBookById(download.bookId)
    if (book?.downloadUrl) {
      toast({
        title: "إعادة التحميل",
        description: `جاري إعادة تحميل "${download.bookTitle}"`,
      })
      // هنا يمكن إضافة منطق إعادة التحميل
    }
  }

  const stats = getDownloadStats()

  return (
    <div className="space-y-6">
      {/* العنوان */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">سجل التحميلات</h1>
        <p className="text-muted-foreground">إدارة وتتبع جميع تحميلاتك</p>
      </div>

      {/* إحصائيات التحميلات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التحميلات</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDownloads}</div>
            <p className="text-xs text-muted-foreground">ملف محمل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الحجم الإجمالي</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSize}</div>
            <p className="text-xs text-muted-foreground">مساحة محملة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل النجاح</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">تحميل ناجح</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">هذا الشهر</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                downloads.filter((d) => {
                  const downloadDate = new Date(d.downloadDate)
                  const now = new Date()
                  return downloadDate.getMonth() === now.getMonth() && downloadDate.getFullYear() === now.getFullYear()
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">تحميل جديد</p>
          </CardContent>
        </Card>
      </div>

      {/* شريط البحث والفلترة */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="ابحث في التحميلات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التحميلات</SelectItem>
                <SelectItem value="completed">مكتملة</SelectItem>
                <SelectItem value="failed">فاشلة</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">التاريخ</SelectItem>
                <SelectItem value="title">العنوان</SelectItem>
                <SelectItem value="author">المؤلف</SelectItem>
                <SelectItem value="size">الحجم</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearHistory}>
              <Trash2 className="h-4 w-4 mr-2" />
              مسح الكل
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* قائمة التحميلات */}
      {filteredDownloads.length === 0 ? (
        <div className="text-center py-12">
          <FileDown className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{downloads.length === 0 ? "لا توجد تحميلات" : "لا توجد نتائج"}</h3>
          <p className="text-muted-foreground">
            {downloads.length === 0 ? "لم تقم بتحميل أي كتب بعد" : "لا توجد تحميلات تطابق معايير البحث"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDownloads.map((download) => (
            <Card key={download.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      <FileDown className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{download.bookTitle}</h3>
                      <p className="text-sm text-muted-foreground">{download.author}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {download.format}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{download.fileSize}</span>
                        <Badge
                          variant={download.status === "completed" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {download.status === "completed" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              مكتمل
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              فاشل
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(download.downloadDate).toLocaleDateString("ar-SA")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(download.downloadDate).toLocaleTimeString("ar-SA", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {download.status === "failed" && (
                      <Button variant="outline" size="sm" onClick={() => redownload(download)}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => removeDownload(download.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
