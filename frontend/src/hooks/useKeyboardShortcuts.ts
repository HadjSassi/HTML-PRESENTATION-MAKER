import { useEffect } from 'react'
import { useCanvasCtx } from '../contexts/CanvasContext'
import { usePresentationStore } from '../store/usePresentationStore'

export function useKeyboardShortcuts() {
  const { canvasRef } = useCanvasCtx()
  const { deleteSlide, presentation, currentSlideIndex } = usePresentationStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      // Don't intercept when typing in inputs
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) return

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const active = canvas.getActiveObject()
        if (active) {
          canvas.remove(active)
          canvas.discardActiveObject()
          canvas.renderAll()
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault()
        canvas.discardActiveObject()
        const sel = new (window as any).fabric.ActiveSelection(
          canvas.getObjects(), { canvas }
        )
        canvas.setActiveObject(sel)
        canvas.renderAll()
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        const active = canvas.getActiveObject() as any
        if (active) {
          active.clone((cloned: any) => {
            cloned.set({ left: active.left + 20, top: active.top + 20 })
            canvas.add(cloned)
            canvas.setActiveObject(cloned)
            canvas.renderAll()
          })
        }
      }

      if (e.key === 'Escape') {
        canvas.discardActiveObject()
        canvas.renderAll()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [canvasRef, deleteSlide, presentation, currentSlideIndex])
}

