export interface BookComment {
  text: string
  author: string
  date: string
}

export interface Download {
  id: string
  bookId: number
  bookTitle: string
  author: string
  downloadDate: string
  fileSize: string
  format: string
  status: "completed" | "failed"
}

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
  comments: BookComment[]
  addedDate?: string // تاريخ إضافة الكتاب
}
