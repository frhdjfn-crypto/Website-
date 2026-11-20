"use client"

import { useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { BookOpen, Download, Users, TrendingUp, Plus, Pencil, Trash2, Search, Upload, LoaderCircle, ShieldCheck, Settings2, Tags, BarChart3, ImageIcon } from "lucide-react"
import { AdminBookInput, AdminUser, SiteSettingsInput, deleteAdminUser, deleteBook, deleteCategory, renameCategory, saveBook, saveSiteSettings } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"

export type DashboardBook = {
  id: number
  title: string
  author: string
  category: string
  year: number | null
  pages: number | null
  language: string | null
  description: string | null
  image_url: string | null
  download_url: string | null
  download_count: number | null
}
export type DashboardSettings = SiteSettingsInput

type Props = {
  books: DashboardBook[]
  categories: { name: string; count: number }[]
  settings: DashboardSettings
  users: AdminUser[]
  stats: { totalBooks: number; totalUsers: number; downloads: number; weeklyDownloads: number; topBooks: DashboardBook[] }
}

const dateFormatter = new Intl.DateTimeFormat("ar", { dateStyle: "medium" })

export function AdminDashboard({ books, categories, settings: initialSettings, users: initialUsers, stats }: Props) {
  const [query, setQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [bookDialogOpen, setBookDialogOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<DashboardBook | null>(null)
  const [deletingBook, setDeletingBook] = useState<DashboardBook | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null)
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [settings, setSettings] = useState(initialSettings)
  const [categoryEdit, setCategoryEdit] = useState<{ from: string; to: string } | null>(null)
  const [users, setUsers] = useState(initialUsers)
  const visibleBooks = useMemo(() => books.filter((book) => {
    const text = `${book.title} ${book.author} ${book.category}`.toLocaleLowerCase("ar")
    return text.includes(query.toLocaleLowerCase("ar")) && (categoryFilter === "all" || book.category === categoryFilter)
  }), [books, categoryFilter, query])

  async function execute(action: () => Promise<void>, success: string) {
    setBusy(true)
    try { await action(); toast.success(success); window.location.reload() }
    catch (error) { toast.error(error instanceof Error ? error.message : "حدث خطأ غير متوقع") }
    finally { setBusy(false) }
  }

  async function uploadFile(file: File, folder: "covers" | "pdf", onProgress: (loaded: number) => void) {
    const extension = folder === "pdf" ? "pdf" : (file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "img").toLowerCase()
    const key = `${folder}/${crypto.randomUUID()}.${extension}`
    const client = createClient()
    const [{ data: { session } }] = await Promise.all([client.auth.getSession()])
    if (!session?.access_token) throw new Error("انتهت الجلسة، يرجى تسجيل الدخول مجدداً")
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const apiKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!baseUrl || !apiKey) throw new Error("إعدادات التخزين غير متاحة")
    const objectPath = key.split("/").map(encodeURIComponent).join("/")
    await new Promise<void>((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.open("POST", `${baseUrl}/storage/v1/object/books/${objectPath}`)
      request.setRequestHeader("apikey", apiKey)
      request.setRequestHeader("Authorization", `Bearer ${session.access_token}`)
      request.setRequestHeader("Content-Type", file.type || "application/octet-stream")
      request.setRequestHeader("x-upsert", "false")
      request.upload.onprogress = (event) => { if (event.lengthComputable) onProgress(event.loaded) }
      request.onerror = () => reject(new Error("تعذر الاتصال بخدمة التخزين"))
      request.onload = () => request.status >= 200 && request.status < 300 ? resolve() : reject(new Error("تعذر رفع الملف إلى التخزين"))
      request.send(file)
    })
    return client.storage.from("books").getPublicUrl(key).data.publicUrl
  }

  async function submitBook(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setBusy(true)
    setUploading(true)
    setUploadProgress(8)
    try {
      const cover = form.get("coverFile") as File
      const pdf = form.get("pdfFile") as File
      let imageUrl = String(form.get("image_url") || "").trim() || null
      let downloadUrl = editingBook?.download_url ?? null
      const totalBytes = cover.size + pdf.size
      let completedBytes = 0
      const reportProgress = (loaded: number) => {
        if (totalBytes > 0) setUploadProgress(8 + Math.round(((completedBytes + loaded) / totalBytes) * 82))
      }
      if (cover.size > 0) {
        imageUrl = await uploadFile(cover, "covers", reportProgress)
        completedBytes += cover.size
      }
      if (pdf.size > 0) {
        downloadUrl = await uploadFile(pdf, "pdf", reportProgress)
        completedBytes += pdf.size
      }
      const input: AdminBookInput = {
        id: editingBook?.id,
        title: String(form.get("title") || ""),
        author: String(form.get("author") || ""),
        category: String(form.get("category") || ""),
        year: form.get("year") ? Number(form.get("year")) : null,
        pages: form.get("pages") ? Number(form.get("pages")) : null,
        language: String(form.get("language") || "العربية"),
        description: String(form.get("description") || ""),
        image_url: imageUrl,
        download_url: downloadUrl,
      }
      await saveBook(input)
      toast.success(editingBook ? "تم تحديث الكتاب" : "تمت إضافة الكتاب")
      setBookDialogOpen(false)
      window.location.reload()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حفظ الكتاب")
    } finally { setBusy(false); setUploading(false); setUploadProgress(0) }
  }

  async function submitSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await execute(() => saveSiteSettings(settings), "تم حفظ إعدادات الموقع")
  }

  return (
    <main className="container mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:py-10" dir="rtl">
      <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><ShieldCheck aria-hidden="true" /></span>
          <div><p className="text-sm text-muted-foreground">إدارة المنصة</p><h1 className="text-2xl font-bold sm:text-3xl">لوحة الإدارة</h1></div>
        </div>
        <Badge variant="secondary" className="w-fit">{stats.totalBooks.toLocaleString("ar")} كتاب في المكتبة</Badge>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="ملخص الإحصائيات">
        <StatCard icon={<BookOpen />} label="إجمالي الكتب" value={stats.totalBooks} />
        <StatCard icon={<Users />} label="المستخدمون" value={stats.totalUsers} />
        <StatCard icon={<Download />} label="إجمالي التحميلات" value={stats.downloads} />
        <StatCard icon={<TrendingUp />} label="تحميلات آخر ٧ أيام" value={stats.weeklyDownloads} />
      </section>

      <Tabs defaultValue="books" dir="rtl" className="flex flex-col gap-5">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-5">
          <TabsTrigger value="books" className="gap-2"><BookOpen /> الكتب</TabsTrigger>
          <TabsTrigger value="categories" className="gap-2"><Tags /> التصنيفات</TabsTrigger>
          <TabsTrigger value="settings" className="gap-2"><Settings2 /> إعدادات الموقع</TabsTrigger>
          <TabsTrigger value="users" className="gap-2"><Users /> المستخدمون</TabsTrigger>
          <TabsTrigger value="stats" className="gap-2"><BarChart3 /> الإحصائيات</TabsTrigger>
        </TabsList>

        <TabsContent value="books" className="mt-0">
          <Card>
            <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div><CardTitle>إدارة الكتب</CardTitle><CardDescription>أضف الكتب وعدّل بياناتها وملفاتها</CardDescription></div>
              <Button onClick={() => { setEditingBook(null); setBookDialogOpen(true) }}><Plus data-icon="inline-start" /> إضافة كتاب</Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1"><Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input aria-label="البحث في الكتب" placeholder="ابحث بالعنوان أو المؤلف..." value={query} onChange={(event) => setQuery(event.target.value)} className="pr-9" /></div>
                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value ?? "all")}>
                  <SelectTrigger className="w-full sm:w-56" aria-label="تصفية حسب التصنيف"><SelectValue placeholder="كل التصنيفات" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">كل التصنيفات</SelectItem>{categories.map((category) => <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>الغلاف</TableHead><TableHead>الكتاب</TableHead><TableHead>المؤلف</TableHead><TableHead>التصنيف</TableHead><TableHead>التحميلات</TableHead><TableHead>الملف</TableHead><TableHead><span className="sr-only">الإجراءات</span></TableHead></TableRow></TableHeader>
                  <TableBody>{visibleBooks.length ? visibleBooks.map((book) => <TableRow key={book.id}>
                    <TableCell>{book.image_url ? <img src={book.image_url} alt={`غلاف ${book.title}`} className="h-14 w-10 rounded object-cover" /> : <span className="flex h-14 w-10 items-center justify-center rounded bg-muted"><ImageIcon className="size-4 text-muted-foreground" /></span>}</TableCell>
                    <TableCell className="min-w-40 font-medium">{book.title}</TableCell><TableCell className="min-w-32">{book.author}</TableCell><TableCell><Badge variant="outline">{book.category}</Badge></TableCell><TableCell>{(book.download_count ?? 0).toLocaleString("ar")}</TableCell><TableCell><Badge variant={book.download_url ? "default" : "secondary"}>{book.download_url ? "متاح" : "غير متاح"}</Badge></TableCell>
                    <TableCell><div className="flex items-center gap-1"><Button variant="ghost" size="icon" aria-label={`تعديل ${book.title}`} onClick={() => { setEditingBook(book); setBookDialogOpen(true) }}><Pencil /></Button><Button variant="ghost" size="icon" aria-label={`حذف ${book.title}`} onClick={() => setDeletingBook(book)}><Trash2 className="text-destructive" /></Button></div></TableCell>
                  </TableRow>) : <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">لا توجد كتب مطابقة.</TableCell></TableRow>}</TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-0"><Card><CardHeader><CardTitle>التصنيفات</CardTitle><CardDescription>تعديل اسم التصنيف يحدّث جميع الكتب المرتبطة به.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto rounded-md border"><Table><TableHeader><TableRow><TableHead>اسم التصنيف</TableHead><TableHead>عدد الكتب</TableHead><TableHead>الإجراءات</TableHead></TableRow></TableHeader><TableBody>{categories.map((category) => <TableRow key={category.name}><TableCell className="font-medium">{category.name}</TableCell><TableCell>{category.count.toLocaleString("ar")}</TableCell><TableCell><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => setCategoryEdit({ from: category.name, to: category.name })}><Pencil data-icon="inline-start" /> تعديل الاسم</Button><Button variant="ghost" size="sm" disabled={category.count > 0} onClick={() => setDeletingCategory(category.name)}><Trash2 data-icon="inline-start" /> حذف</Button></div></TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card></TabsContent>

        <TabsContent value="settings" className="mt-0"><Card><CardHeader><CardTitle>إعدادات الموقع</CardTitle><CardDescription>تظهر التغييرات على الموقع بعد الحفظ.</CardDescription></CardHeader><CardContent><form onSubmit={submitSettings} className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2"><SettingInput label="اسم الموقع" value={settings.site_name} onChange={(site_name) => setSettings({ ...settings, site_name })} /><SettingInput label="عنوان الواجهة الرئيسية" value={settings.hero_title} onChange={(hero_title) => setSettings({ ...settings, hero_title })} /><div className="sm:col-span-2"><Label htmlFor="hero-subtitle">الوصف الرئيسي</Label><Textarea id="hero-subtitle" value={settings.hero_subtitle} onChange={(event) => setSettings({ ...settings, hero_subtitle: event.target.value })} rows={3} /></div><div className="sm:col-span-2"><Label htmlFor="footer-text">نص التذييل</Label><Textarea id="footer-text" value={settings.footer_text} onChange={(event) => setSettings({ ...settings, footer_text: event.target.value })} rows={3} /></div><SettingInput label="البريد الإلكتروني للتواصل" type="email" value={settings.contact_email} onChange={(contact_email) => setSettings({ ...settings, contact_email })} /><SettingInput label="هاتف التواصل" value={settings.contact_phone} onChange={(contact_phone) => setSettings({ ...settings, contact_phone })} /></div>
          <div className="grid gap-3 sm:grid-cols-2">{(["show_random", "show_newest", "show_most_downloaded", "show_most_rated"] as const).map((key) => <div key={key} className="flex items-center justify-between rounded-lg border p-4"><Label htmlFor={key} className="cursor-pointer">{{ show_random: "قائمة الكتب", show_newest: "أحدث الكتب", show_most_downloaded: "الأكثر تحميلاً", show_most_rated: "الأعلى تقييماً" }[key]}</Label><Switch id={key} checked={settings[key]} onCheckedChange={(checked) => setSettings({ ...settings, [key]: checked })} /></div>)}</div>
          <Button type="submit" disabled={busy} className="w-fit">{busy ? <LoaderCircle className="animate-spin" /> : null} حفظ الإعدادات</Button>
        </form></CardContent></Card></TabsContent>

        <TabsContent value="users" className="mt-0"><Card><CardHeader><CardTitle>المستخدمون المسجلون</CardTitle><CardDescription>إدارة حسابات المستخدمين وصلاحياتهم.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto rounded-md border"><Table><TableHeader><TableRow><TableHead>البريد الإلكتروني</TableHead><TableHead>تاريخ التسجيل</TableHead><TableHead>آخر تسجيل دخول</TableHead><TableHead><span className="sr-only">الإجراءات</span></TableHead></TableRow></TableHeader><TableBody>{users.map((user) => <TableRow key={user.id}><TableCell dir="ltr" className="text-right">{user.email ?? "—"}</TableCell><TableCell>{dateFormatter.format(new Date(user.created_at))}</TableCell><TableCell>{user.last_sign_in_at ? dateFormatter.format(new Date(user.last_sign_in_at)) : "لم يسجل الدخول"}</TableCell><TableCell><Button variant="ghost" size="icon" aria-label={`حذف المستخدم ${user.email ?? ""}`} onClick={() => setDeletingUser(user)}><Trash2 className="text-destructive" /></Button></TableCell></TableRow>)}{users.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">لا يوجد مستخدمون.</TableCell></TableRow>}</TableBody></Table></div><p className="mt-3 text-xs text-muted-foreground">يتم تنفيذ عمليات المستخدمين على الخادم بعد إعادة التحقق من صلاحية الإدارة.</p></CardContent></Card></TabsContent>

        <TabsContent value="stats" className="mt-0"><div className="grid gap-5 lg:grid-cols-2"><Card><CardHeader><CardTitle>ملخص المنصة</CardTitle><CardDescription>مؤشرات المكتبة والتنزيل خلال آخر أسبوع.</CardDescription></CardHeader><CardContent className="grid grid-cols-2 gap-3"><Metric label="الكتب" value={stats.totalBooks} /><Metric label="المستخدمون" value={stats.totalUsers} /><Metric label="كل التحميلات" value={stats.downloads} /><Metric label="آخر ٧ أيام" value={stats.weeklyDownloads} /></CardContent></Card><Card><CardHeader><CardTitle>الأكثر تحميلاً</CardTitle><CardDescription>أعلى خمسة كتب حسب عداد التنزيلات.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4">{stats.topBooks.map((book, index) => <div key={book.id} className="flex items-center gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate font-medium">{book.title}</p><p className="truncate text-sm text-muted-foreground">{book.author}</p></div><Badge variant="secondary">{(book.download_count ?? 0).toLocaleString("ar")}</Badge></div>)}{stats.topBooks.length === 0 && <p className="text-sm text-muted-foreground">لا توجد بيانات بعد.</p>}</CardContent></Card></div></TabsContent>
      </Tabs>

      <Dialog open={bookDialogOpen} onOpenChange={setBookDialogOpen}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>{editingBook ? "تعديل كتاب" : "إضافة كتاب"}</DialogTitle><DialogDescription>الحقول التي تحمل علامة * مطلوبة. الملفات ترفع مباشرة إلى التخزين.</DialogDescription></DialogHeader><form onSubmit={submitBook} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label htmlFor="book-title">العنوان *</Label><Input id="book-title" name="title" required defaultValue={editingBook?.title ?? ""} maxLength={200} /></div><div className="flex flex-col gap-2"><Label htmlFor="book-author">المؤلف *</Label><Input id="book-author" name="author" required defaultValue={editingBook?.author ?? ""} maxLength={160} /></div><div className="flex flex-col gap-2"><Label htmlFor="book-category">التصنيف *</Label><Input id="book-category" name="category" required list="book-categories" defaultValue={editingBook?.category ?? ""} maxLength={120} /><datalist id="book-categories">{categories.map((category) => <option key={category.name} value={category.name} />)}</datalist></div><div className="flex flex-col gap-2"><Label htmlFor="book-language">اللغة</Label><Input id="book-language" name="language" defaultValue={editingBook?.language ?? "العربية"} /></div><div className="flex flex-col gap-2"><Label htmlFor="book-year">سنة النشر</Label><Input id="book-year" name="year" type="number" defaultValue={editingBook?.year ?? ""} /></div><div className="flex flex-col gap-2"><Label htmlFor="book-pages">عدد الصفحات</Label><Input id="book-pages" name="pages" type="number" min="1" defaultValue={editingBook?.pages ?? ""} /></div></div>
        <div className="flex flex-col gap-2"><Label htmlFor="book-description">الوصف</Label><Textarea id="book-description" name="description" defaultValue={editingBook?.description ?? ""} rows={4} maxLength={5000} /></div>
        <div className="flex flex-col gap-2"><Label htmlFor="book-cover-url">رابط الغلاف (اختياري)</Label><Input id="book-cover-url" name="image_url" type="url" dir="ltr" placeholder="https://..." defaultValue={editingBook?.image_url ?? ""} /></div>
        <div className="grid gap-4 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label htmlFor="cover-file">رفع صورة الغلاف</Label><Input id="cover-file" name="coverFile" type="file" accept="image/*" /><span className="text-xs text-muted-foreground">يُسمح بملفات الصور فقط.</span></div><div className="flex flex-col gap-2"><Label htmlFor="pdf-file">ملف PDF</Label><Input id="pdf-file" name="pdfFile" type="file" accept="application/pdf,.pdf" /><span className="text-xs text-muted-foreground">{editingBook?.download_url ? "رفع ملف جديد يستبدل رابط الملف الحالي." : "ارفع كتاباً بصيغة PDF."}</span></div></div>
        {uploading && <div className="flex flex-col gap-2" role="status"><div className="flex items-center gap-2 text-sm"><LoaderCircle className="size-4 animate-spin" /> جارٍ رفع الملفات مباشرة إلى التخزين</div><Progress value={uploadProgress} aria-label="حالة رفع الملفات" /></div>}
        <DialogFooter><Button type="button" variant="outline" onClick={() => setBookDialogOpen(false)}>إلغاء</Button><Button type="submit" disabled={busy}>{busy && <LoaderCircle className="animate-spin" />} حفظ الكتاب</Button></DialogFooter>
      </form></DialogContent></Dialog>

      <ConfirmDialog open={Boolean(deletingBook)} title="حذف الكتاب؟" description={`سيتم حذف «${deletingBook?.title ?? ""}» وملفاته المخزنة نهائياً.`} busy={busy} onCancel={() => setDeletingBook(null)} onConfirm={() => deletingBook && execute(() => deleteBook(deletingBook.id), "تم حذف الكتاب")} />
      <ConfirmDialog open={Boolean(deletingCategory)} title="حذف التصنيف؟" description="لا يمكن حذف تصنيف مرتبط بكتب. هل تريد المتابعة؟" busy={busy} onCancel={() => setDeletingCategory(null)} onConfirm={() => deletingCategory && execute(() => deleteCategory(deletingCategory), "تم حذف التصنيف")} />
      <ConfirmDialog open={Boolean(deletingUser)} title="حذف حساب المستخدم؟" description={`سيتم حذف حساب ${deletingUser?.email ?? "هذا المستخدم"} بشكل نهائي.`} busy={busy} onCancel={() => setDeletingUser(null)} onConfirm={() => deletingUser && execute(async () => { await deleteAdminUser(deletingUser.id); setUsers((current) => current.filter((user) => user.id !== deletingUser.id)) }, "تم حذف المستخدم")} />

      <Dialog open={Boolean(categoryEdit)} onOpenChange={(open) => !open && setCategoryEdit(null)}><DialogContent><DialogHeader><DialogTitle>تعديل التصنيف</DialogTitle><DialogDescription>سيتم تحديث التصنيف لجميع الكتب الحالية.</DialogDescription></DialogHeader><div className="flex flex-col gap-2"><Label htmlFor="rename-category">اسم التصنيف الجديد</Label><Input id="rename-category" value={categoryEdit?.to ?? ""} onChange={(event) => setCategoryEdit((current) => current ? { ...current, to: event.target.value } : current)} /></div><DialogFooter><Button variant="outline" onClick={() => setCategoryEdit(null)}>إلغاء</Button><Button disabled={busy || !categoryEdit?.to.trim()} onClick={() => categoryEdit && execute(() => renameCategory(categoryEdit.from, categoryEdit.to), "تم تعديل التصنيف")}>حفظ</Button></DialogFooter></DialogContent></Dialog>
    </main>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return <Card><CardContent className="flex items-center gap-4 p-5"><span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span><div><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-bold">{value.toLocaleString("ar")}</p></div></CardContent></Card>
}
function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-lg bg-muted/60 p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-xl font-bold">{value.toLocaleString("ar")}</p></div> }
function SettingInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) { const id = label.replaceAll(" ", "-"); return <div className="flex flex-col gap-2"><Label htmlFor={id}>{label}</Label><Input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} /></div> }
function ConfirmDialog({ open, title, description, busy, onCancel, onConfirm }: { open: boolean; title: string; description: string; busy: boolean; onCancel: () => void; onConfirm: () => void }) { return <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{title}</AlertDialogTitle><AlertDialogDescription>{description}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={busy} onClick={onCancel}>إلغاء</AlertDialogCancel><AlertDialogAction disabled={busy} onClick={(event) => { event.preventDefault(); onConfirm() }}>{busy ? <LoaderCircle className="animate-spin" /> : <Trash2 />} تأكيد الحذف</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog> }
