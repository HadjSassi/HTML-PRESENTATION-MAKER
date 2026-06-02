import { useEffect } from 'react'
import { useCanvasCtx } from '../contexts/CanvasContext'
import {
  deleteActiveObject,
  duplicateActiveObject,
  redoCanvas,
  selectAllObjects,
  undoCanvas,
} from './useCanvasActions'

export function useKeyboardShortcuts() {
  const { canvasRef } = useCanvasCtx()

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
        deleteActiveObject(canvas)
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault()
        selectAllObjects(canvas)
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        duplicateActiveObject(canvas)
      }

      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        undoCanvas(canvas)
      }

      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault()
        redoCanvas(canvas)
      }

      if (e.key === 'Escape') {
        canvas.discardActiveObject()
        canvas.renderAll()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [canvasRef])
}

