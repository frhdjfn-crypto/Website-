import { Button } from "@/components/ui/button"
import { BookIcon, Home } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-6">
        <BookIcon className="h-24 w-24 text-muted-foreground" />
        <h1 className="text-4xl font-bold">الصفحة غير موجودة</h1>
        <p className="text-xl text-muted-foreground">عذراً، لم نتمكن من العثور على الصفحة المطلوبة</p>
        <Button asChild size="lg">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            العودة للصفحة الرئيسية
          </Link>
        </Button>
      </div>
    </div>
  )
}
