export interface Book {
  id: number
  title: string
  author: string
  category: string
  rating: number
  year: number
  pages?: number
  language?: string
  description: string
  downloadUrl?: string
  fileSize?: string
  format?: string
  downloadCount?: number
  imageUrl?: string
  comments: Comment[]
  addedDate?: string // تاريخ إضافة الكتاب
}
