"use client"

import { createContext, useContext } from "react"

// Define the Toast type
type Toast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

type ToastContextType = {
  toasts: Toast[]
  toast: (props: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  
  if (!context) {
    // Instead of throwing an error, provide a mock implementation
    return {
      toasts: [],
      toast: () => console.log("Toast provider not found"),
      dismiss: () => {},
    }
  }
  
  return context
}

export type ToastProps = Toast 