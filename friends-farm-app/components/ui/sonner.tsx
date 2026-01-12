"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 text-white" />,
        info: <InfoIcon className="size-5 text-white" />,
        warning: <TriangleAlertIcon className="size-5 text-white" />,
        error: <OctagonXIcon className="size-5 text-white" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "group toast flex items-center gap-3 p-4 rounded-2xl shadow-2xl border min-w-[300px] font-bold",
          title: "text-sm font-black",
          description: "text-xs opacity-80",
          success: "bg-[#1B5E20] text-white border-green-700",
          error: "bg-red-600 text-white border-red-700",
          warning: "bg-orange-500 text-white border-orange-600",
          info: "bg-blue-600 text-white border-blue-700",
          loading: "bg-gray-800 text-white border-gray-700",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

