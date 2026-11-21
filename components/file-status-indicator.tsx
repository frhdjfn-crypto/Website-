"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertCircle, Clock, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { checkFileExists } from "@/lib/download-utils"

interface FileStatusIndicatorProps {
  filePath: string
  fileName?: string
  size?: "sm" | "md" | "lg"
}

export function FileStatusIndicator({ filePath, fileName, size = "md" }: FileStatusIndicatorProps) {
  const [status, setStatus] = useState<"checking" | "available" | "unavailable">("checking")
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkStatus = async () => {
    setStatus("checking")
    try {
      const exists = await checkFileExists(filePath)
      setStatus(exists ? "available" : "unavailable")
      setLastChecked(new Date())
    } catch (error) {
      setStatus("unavailable")
      setLastChecked(new Date())
    }
  }

  useEffect(() => {
    checkStatus()
  }, [filePath])

  const getIcon = () => {
    switch (status) {
      case "checking":
        return <Clock className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} animate-pulse`} />
      case "available":
        return <CheckCircle className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} text-green-500`} />
      case "unavailable":
        return <AlertCircle className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} text-red-500`} />
    }
  }

  const getVariant = () => {
    switch (status) {
      case "checking":
        return "secondary"
      case "available":
        return "default"
      case "unavailable":
        return "destructive"
    }
  }

  const getText = () => {
    switch (status) {
      case "checking":
        return "جاري التحقق..."
      case "available":
        return "متاح"
      case "unavailable":
        return "غير متاح"
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Badge variant={getVariant()} className={`${size === "sm" ? "text-xs" : ""}`}>
              {getIcon()}
              <span className="mr-1">{getText()}</span>
            </Badge>
            {status !== "checking" && (
              <Button variant="ghost" size="sm" onClick={checkStatus} className="h-6 w-6 p-0">
                <RefreshCw className="h-3 w-3" />
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p>
              <strong>الملف:</strong> {fileName || filePath.split("/").pop()}
            </p>
            <p>
              <strong>المسار:</strong> {filePath}
            </p>
            <p>
              <strong>الحالة:</strong> {getText()}
            </p>
            {lastChecked && (
              <p>
                <strong>آخر فحص:</strong> {lastChecked.toLocaleTimeString("ar-SA")}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
