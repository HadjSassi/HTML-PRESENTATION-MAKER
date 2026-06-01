import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { v4 as uuid } from 'uuid'
import type { Presentation, Slide, Animation } from '../types'

const newSlide = (n: number): Slide => ({
  id: uuid(), title: `Slide ${n}`, backgroundColor: '#FFFFFF',
  canvasJson: '{}', animation: { type: 'fade', duration: 0.6 },
})

const newPresentation = (): Presentation => ({
  id: uuid(), title: 'My Presentation', author: '', savePath: '',
  slides: [newSlide(1)], version: '2.0',
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
})

interface Store {
  presentation: Presentation
  currentSlideIndex: number
  selectedObjectId: string | null
  isPreviewOpen: boolean
  isDirty: boolean
  // Actions
  reset: () => void
  load: (p: Presentation) => void
  setPresentationInfo: (info: Partial<Pick<Presentation, 'title' | 'author' | 'savePath'>>) => void
  addSlide: () => void
  duplicateSlide: (idx: number) => void
  deleteSlide: (id: string) => void
  moveSlide: (from: number, to: number) => void
  selectSlide: (idx: number) => void
  updateCanvas: (idx: number, json: string, thumb?: string) => void
  updateSlideBackground: (idx: number, color: string) => void
  updateSlideAnimation: (idx: number, anim: Animation) => void
  updateSlideTitle: (idx: number, title: string) => void
  setSelectedObjectId: (id: string | null) => void
  togglePreview: () => void
}

export const usePresentationStore = create<Store>()(
  immer((set) => ({
    presentation: newPresentation(),
    currentSlideIndex: 0,
    selectedObjectId: null,
    isPreviewOpen: false,
    isDirty: false,

    reset: () => set((s) => { s.presentation = newPresentation(); s.currentSlideIndex = 0; s.selectedObjectId = null; s.isDirty = false }),
    load: (p) => set((s) => { s.presentation = p; s.currentSlideIndex = 0; s.selectedObjectId = null; s.isDirty = false }),
    setPresentationInfo: (info) => set((s) => { Object.assign(s.presentation, info); s.isDirty = true }),

    addSlide: () => set((s) => {
      s.presentation.slides.push(newSlide(s.presentation.slides.length + 1))
      s.currentSlideIndex = s.presentation.slides.length - 1
      s.selectedObjectId = null; s.isDirty = true
    }),
    duplicateSlide: (idx) => set((s) => {
      const copy = { ...s.presentation.slides[idx], id: uuid() }
      s.presentation.slides.splice(idx + 1, 0, copy)
      s.currentSlideIndex = idx + 1; s.isDirty = true
    }),
    deleteSlide: (id) => set((s) => {
      if (s.presentation.slides.length <= 1) return
      const idx = s.presentation.slides.findIndex((sl) => sl.id === id)
      s.presentation.slides.splice(idx, 1)
      s.currentSlideIndex = Math.min(s.currentSlideIndex, s.presentation.slides.length - 1)
      s.selectedObjectId = null; s.isDirty = true
    }),
    moveSlide: (from, to) => set((s) => {
      const [sl] = s.presentation.slides.splice(from, 1)
      s.presentation.slides.splice(to, 0, sl)
      s.currentSlideIndex = to; s.isDirty = true
    }),
    selectSlide: (idx) => set((s) => { s.currentSlideIndex = idx; s.selectedObjectId = null }),

    updateCanvas: (idx, json, thumb) => set((s) => {
      if (!s.presentation.slides[idx]) return
      s.presentation.slides[idx].canvasJson = json
      if (thumb) s.presentation.slides[idx].thumbnail = thumb
      s.isDirty = true
    }),
    updateSlideBackground: (idx, color) => set((s) => { s.presentation.slides[idx].backgroundColor = color; s.isDirty = true }),
    updateSlideAnimation: (idx, anim) => set((s) => { s.presentation.slides[idx].animation = anim; s.isDirty = true }),
    updateSlideTitle: (idx, title) => set((s) => { s.presentation.slides[idx].title = title; s.isDirty = true }),

    setSelectedObjectId: (id) => set((s) => { s.selectedObjectId = id }),
    togglePreview: () => set((s) => { s.isPreviewOpen = !s.isPreviewOpen }),
  }))
)

