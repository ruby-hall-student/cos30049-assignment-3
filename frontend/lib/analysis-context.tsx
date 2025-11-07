"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { AnalysisResult } from "./analyzer"

interface AnalysisContextType {
  result: AnalysisResult | null
  setResult: (result: AnalysisResult | null) => void
  hasResults: boolean
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined)

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<AnalysisResult | null>(null)

  return (
    <AnalysisContext.Provider value={{ result, setResult, hasResults: !!result }}>{children}</AnalysisContext.Provider>
  )
}

export function useAnalysis() {
  const context = useContext(AnalysisContext)
  if (!context) {
    throw new Error("useAnalysis must be used within AnalysisProvider")
  }
  return context
}
