import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { v4 as uuid } from 'uuid'
import type { Presentation, Slide, Animation } from '../types'
import type { ShapeStyle, ShapeDrawMode } from '../types'

const defaultShapeStyle: ShapeStyle = {
  fill: '#8b5cf6',
  stroke: '#4c1d95',
  strokeWidth: 2,
  opacity: 1,
}

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
  lastSelectedTextColor: string | null
  shapeStyle: ShapeStyle
  shapeDrawMode: ShapeDrawMode
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
  setLastSelectedTextColor: (color: string) => void
  setShapeStyle: (style: Partial<ShapeStyle>) => void
  setShapeDrawMode: (mode: ShapeDrawMode) => void
  togglePreview: () => void
  updateObject: (props: any) => void
}

const renumberSlides = (slides: Slide[]) => {
  return slides.map((slide, index) => ({
    ...slide,
    title: slide.title.match(/^Slide \d+$/) ? `Slide ${index + 1}` : slide.title,
  }))
}

export const usePresentationStore = create<Store>()(
  immer((set) => ({
    presentation: newPresentation(),
    currentSlideIndex: 0,
    selectedObjectId: null,
    lastSelectedTextColor: null,
    shapeStyle: defaultShapeStyle,
    shapeDrawMode: 'none',
    isPreviewOpen: false,
    isDirty: false,

    reset: () => set((s) => { s.presentation = newPresentation(); s.currentSlideIndex = 0; s.selectedObjectId = null; s.lastSelectedTextColor = null; s.shapeStyle = defaultShapeStyle; s.shapeDrawMode = 'none'; s.isDirty = false }),
    load: (p) => set((s) => { s.presentation = p; s.currentSlideIndex = 0; s.selectedObjectId = null; s.lastSelectedTextColor = null; s.shapeStyle = defaultShapeStyle; s.shapeDrawMode = 'none'; s.isDirty = false }),
    setPresentationInfo: (info) => set((s) => { Object.assign(s.presentation, info); s.isDirty = true }),

    addSlide: () => set((s) => {
      s.presentation.slides.push(newSlide(s.presentation.slides.length + 1))
      s.currentSlideIndex = s.presentation.slides.length - 1
      s.selectedObjectId = null; s.isDirty = true
    }),
    duplicateSlide: (idx) => set((s) => {
      const copy = { ...s.presentation.slides[idx], id: uuid() }
      s.presentation.slides.splice(idx + 1, 0, copy)
      s.presentation.slides = renumberSlides(s.presentation.slides)
      s.currentSlideIndex = idx + 1; s.isDirty = true
    }),
    deleteSlide: (id) => set((s) => {
      if (s.presentation.slides.length <= 1) return
      const idx = s.presentation.slides.findIndex((sl) => sl.id === id)
      s.presentation.slides.splice(idx, 1)
      s.presentation.slides = renumberSlides(s.presentation.slides)
      s.currentSlideIndex = Math.min(s.currentSlideIndex, s.presentation.slides.length - 1)
      s.selectedObjectId = null; s.isDirty = true
    }),
    moveSlide: (from, to) => set((s) => {
      const [sl] = s.presentation.slides.splice(from, 1)
      s.presentation.slides.splice(to, 0, sl)
      s.presentation.slides = renumberSlides(s.presentation.slides)
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
    setLastSelectedTextColor: (color) => set((s) => { s.lastSelectedTextColor = color }),
    setShapeStyle: (style) => set((s) => { s.shapeStyle = { ...s.shapeStyle, ...style } }),
    setShapeDrawMode: (mode) => set((s) => { s.shapeDrawMode = mode }),
    togglePreview: () => set((s) => { s.isPreviewOpen = !s.isPreviewOpen }),
    updateObject: (props) => set((s) => {
      const obj = (window as any).__fabric_canvas?.getActiveObject()
      if (obj) {
        obj.set(props)
        ;(window as any).__fabric_canvas?.renderAll()
        ;(window as any).__fabric_canvas?.fire('object:modified', { target: obj } as any)
      }
    }),
  }))
)