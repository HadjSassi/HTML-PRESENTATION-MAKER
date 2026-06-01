import type { Presentation } from '../types'
import { HPM_EXT } from './constants'

/** Trigger a file download in the browser */
function download(data: string | Blob, filename: string, mime = 'application/octet-stream') {
  const url = typeof data === 'string'
    ? `data:${mime};charset=utf-8,${encodeURIComponent(data)}`
    : URL.createObjectURL(data)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  if (typeof data !== 'string') URL.revokeObjectURL(url)
}

/** Export presentation as .hpm (JSON) file */
export function exportHpm(presentation: Presentation): void {
  const json = JSON.stringify(camelToSnake(presentation), null, 2)
  download(json, `${presentation.title}${HPM_EXT}`, 'application/json')
}

/** Import presentation from a .hpm File object */
export function importHpm(file: File): Promise<Presentation> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        resolve(snakeToCamel(data) as Presentation)
      } catch { reject(new Error('Invalid .hpm file')) }
    }
    reader.onerror = () => reject(new Error('File read error'))
    reader.readAsText(file)
  })
}

/** Read a file as base64 data URI */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/** camelCase → snake_case (for API compatibility) */
function camelToSnake(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(camelToSnake)
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        k.replace(/([A-Z])/g, '_$1').toLowerCase(), camelToSnake(v),
      ])
    )
  }
  return obj
}

/** snake_case → camelCase (from API / file) */
function snakeToCamel(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(snakeToCamel)
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()), snakeToCamel(v),
      ])
    )
  }
  return obj
}

