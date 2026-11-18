"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Home, BookOpen, List, UserRound, Settings, Mail, Book, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HamburgerMenu() {
  const { toggleSidebar, open } = useSidebar()

  return (
    <Button
      onClick={toggleSidebar}
      className="fixed right-4 top-4 z-50 h-12 w-12 rounded-lg bg-primary p-0 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary-dark"
      size="icon"
    >
      <div className="flex h-6 w-6 flex-col items-center justify-center gap-1">
        <span
          className={`block h-0.5 w-6 bg-white transition-all duration-300 ${open ? "translate-y-1.5 rotate-45" : ""}`}
        />
        <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${open ? "opacity-0" : ""}`} />
        <span
          className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
            open ? "-translate-y-1.5 -rotate-45" : ""
          }`}
        />
      </div>
    </Button>
  )
}

export function AppSidebar() {
  const { toast } = useToast()
  const { setOpen } = useSidebar()
  const router = useRouter()

  const handleNavigation = (page: string, path?: string) => {
    setOpen(false) // Close sidebar when navigating

    if (path) {
      router.push(path)
    } else {
      toast({
        title: "تمت محاكاة التنقل",
        description: `تم الانتقال إلى: ${page}`,
      })
    }
  }

  return (
    <>
      <HamburgerMenu />
      <Sidebar side="right" className="border-l border-border">
        <SidebarHeader className="flex items-center justify-between bg-primary p-4 text-white">
          <div className="flex items-center gap-2">
            <Book className="h-6 w-6" />
            <h3 className="text-xl font-bold">زيتونة بوك</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </SidebarHeader>
        <SidebarContent className="bg-sidebar">
          <SidebarMenu className="p-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleNavigation("الصفحة الرئيسية", "/")}
                className="flex items-center gap-3 rounded-lg p-3 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Home className="h-5 w-5" />
                <span className="text-base">الصفحة الرئيسية</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleNavigation("مكتبتي الشخصية", "/library")}
                className="flex items-center gap-3 rounded-lg p-3 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <BookOpen className="h-5 w-5" />
                <span className="text-base">مكتبتي الشخصية</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleNavigation("التحميلات", "/downloads")}
                className="flex items-center gap-3 rounded-lg p-3 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Download className="h-5 w-5" />
                <span className="text-base">التحميلات</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleNavigation("التصنيفات", "/categories")}
                className="flex items-center gap-3 rounded-lg p-3 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <List className="h-5 w-5" />
                <span className="text-base">التصنيفات</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleNavigation("المؤلفين", "/authors")}
                className="flex items-center gap-3 rounded-lg p-3 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <UserRound className="h-5 w-5" />
                <span className="text-base">المؤلفين</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleNavigation("الإعدادات")}
                className="flex items-center gap-3 rounded-lg p-3 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Settings className="h-5 w-5" />
                <span className="text-base">الإعدادات</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleNavigation("اتصل بنا")}
                className="flex items-center gap-3 rounded-lg p-3 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Mail className="h-5 w-5" />
                <span className="text-base">اتصل بنا</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </>
  )
}
