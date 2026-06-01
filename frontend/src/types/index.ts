export type AnimationType =
  | 'none'
  | 'fade'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'

export interface Animation {
  type: AnimationType
  duration: number
}

export interface Slide {
  id: string
  title: string
  backgroundColor: string
  canvasJson: string
  animation: Animation
  thumbnail?: string
}

export interface Presentation {
  id: string
  title: string
  author: string
  savePath: string
  slides: Slide[]
  version: string
  createdAt: string
  updatedAt: string
}

export interface SelectedObjectInfo {
  id: string
  type: string
  props: Record<string, unknown>
}

export const ANIMATION_OPTIONS: { value: AnimationType; label: string }[] = [
  { value: 'none',        label: '⛔ None' },
  { value: 'fade',        label: '✨ Fade In' },
  { value: 'slide-left',  label: '◀ Slide from Left' },
  { value: 'slide-right', label: '▶ Slide from Right' },
  { value: 'zoom-in',     label: '🔍 Zoom In' },
]

