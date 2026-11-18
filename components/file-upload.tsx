"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Upload, File, X } from "lucide-react"

interface FileUploadProps {
  onFileUpload: (file: File, url: string) => void
  acceptedTypes?: string[]
  maxSize?: number // بالميجابايت
}

export function FileUpload({
  onFileUpload,
  acceptedTypes = [".pdf", ".epub", ".mobi"],
  maxSize = 50,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      // التحقق من نوع الملف
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
      if (!acceptedTypes.includes(fileExtension)) {
        toast({
          title: "نوع ملف غير مدعوم",
          description: `الأنواع المدعومة: ${acceptedTypes.join(", ")}`,
          variant: "destructive",
        })
        return
      }

      // التحقق من حجم الملف
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "حجم الملف كبير جداً",
          description: `الحد الأقصى للحجم: ${maxSize} ميجابايت`,
          variant: "destructive",
        })
        return
      }

      // إنشاء URL للملف
      const fileUrl = URL.createObjectURL(file)

      // إضافة الملف إلى القائمة
      setUploadedFiles((prev) => [...prev, file])

      // استدعاء دالة الرفع
      onFileUpload(file, fileUrl)

      toast({
        title: "تم رفع الملف",
        description: `تم رفع "${file.name}" بنجاح`,
      })
    })
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          رفع ملفات الكتب
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium">اسحب الملفات هنا أو انقر للاختيار</p>
              <p className="text-sm text-gray-500 mt-1">
                الأنواع المدعومة: {acceptedTypes.join(", ")} (حتى {maxSize} ميجابايت)
              </p>
            </div>
            <Button onClick={onButtonClick} variant="outline">
              اختيار الملفات
            </Button>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <Label className="text-sm font-medium">الملفات المرفوعة:</Label>
            <div className="mt-2 space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <File className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} ميجابايت</p>
                    </div>
                  </div>
                  <Button onClick={() => removeFile(index)} variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
