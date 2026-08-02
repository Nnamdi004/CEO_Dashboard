import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Currency } from "@/types/domain"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CURRENCY_LOCALE: Record<Currency, string> = {
  NGN: "en-NG",
  USD: "en-US",
  GBP: "en-GB",
  EUR: "en-IE",
}

export function formatCurrency(
  amount: number,
  currency: Currency = "NGN",
  options?: { compact?: boolean }
) {
  return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: options?.compact ? 1 : 0,
    notation: options?.compact ? "compact" : "standard",
  }).format(amount)
}

export function formatNumber(value: number, options?: { compact?: boolean }) {
  return new Intl.NumberFormat("en-US", {
    notation: options?.compact ? "compact" : "standard",
    maximumFractionDigits: options?.compact ? 1 : 0,
  }).format(value)
}

export function formatDate(date: string | Date, style: "short" | "long" = "short") {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: style,
  }).format(d)
}

export function relativeTime(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date
  const diffMs = d.getTime() - Date.now()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

  if (Math.abs(diffDays) < 1) {
    const diffHours = Math.round(diffMs / (1000 * 60 * 60))
    return rtf.format(diffHours, "hour")
  }
  if (Math.abs(diffDays) < 30) {
    return rtf.format(diffDays, "day")
  }
  const diffMonths = Math.round(diffDays / 30)
  return rtf.format(diffMonths, "month")
}

export function daysBetween(a: string | Date, b: string | Date) {
  const dA = typeof a === "string" ? new Date(a) : a
  const dB = typeof b === "string" ? new Date(b) : b
  return Math.round((dB.getTime() - dA.getTime()) / (1000 * 60 * 60 * 24))
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

let idCounter = 0
export function generateId(prefix: string) {
  idCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${idCounter.toString(36)}`
}
