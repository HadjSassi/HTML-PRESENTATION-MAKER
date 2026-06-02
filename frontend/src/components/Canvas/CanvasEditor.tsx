import { useRef, useEffect } from 'react'
import { useFabricCanvas } from '../../hooks/useFabricCanvas'
import { useCanvasCtx } from '../../contexts/CanvasContext'
import { usePresentationStore } from '../../store/usePresentationStore'
import { CANVAS_W, CANVAS_H } from '../../utils/constants'

function ZoomControls({ zoom, onZoom }: { zoom: number; onZoom: (z: number) => void }) {
  return (
    <div className="flex items-center gap-2 bg-panel/80 backdrop-blur-sm
      border border-border rounded-lg px-3 py-1.5 text-xs text-textSecondary">
      <button onClick={() => onZoom(zoom - 0.1)}
        className="hover:text-textPrimary transition-colors font-mono text-base leading-none">−</button>
      <span className="w-12 text-center font-mono">{Math.round(zoom * 100)}%</span>
      <button onClick={() => onZoom(zoom + 0.1)}
        className="hover:text-textPrimary transition-colors font-mono text-base leading-none">+</button>
      <button onClick={() => onZoom(1)}
        className="hover:text-accent transition-colors ml-1">Reset</button>
    </div>
  )
}

export function CanvasEditor() {
  const canvasElRef = useRef<HTMLCanvasElement>(null)
  const { canvasRef } = useCanvasCtx()
  const fabricRef = useFabricCanvas(canvasElRef)
  const { presentation, currentSlideIndex } = usePresentationStore()
  const zoomRef = useRef(1)

  // Share fabric canvas via context
  useEffect(() => {
    if (fabricRef.current) {
      (canvasRef as React.MutableRefObject<typeof fabricRef.current>).current = fabricRef.current
      ;(window as any).__fabric_canvas = fabricRef.current
    }
  }, [fabricRef.current])

  const slide = presentation.slides[currentSlideIndex]

  // Background color sync
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas || !slide) return
    canvas.backgroundColor = slide.backgroundColor
    canvas.renderAll()
  }, [slide?.backgroundColor])

  const handleZoom = (z: number) => {
    const canvas = fabricRef.current
    if (!canvas) return
    const clamped = Math.max(0.2, Math.min(2, z))
    zoomRef.current = clamped
    canvas.setZoom(clamped)
    canvas.setDimensions({ width: CANVAS_W * clamped, height: CANVAS_H * clamped })
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-base overflow-auto p-8 gap-4">
      {/* Slide info bar */}
      <div className="flex items-center gap-2 text-xs text-textMuted self-stretch justify-center">
        <span className="text-textSecondary font-medium">{slide?.title}</span>
        <span>·</span>
        <span>{currentSlideIndex + 1} / {presentation.slides.length}</span>
      </div>

      {/* Canvas wrapper */}
      <div
        className="rounded-lg overflow-hidden shadow-canvas"
        style={{ boxShadow: '0 20px 80px rgba(0,0,0,0.7)' }}
      >
        <canvas ref={canvasElRef} />
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-between self-stretch">
        <div className="flex items-center gap-2 text-xs text-textMuted">
          <span>{CANVAS_W} × {CANVAS_H}px</span>
        </div>
        <ZoomControls zoom={zoomRef.current} onZoom={handleZoom} />
        <div className="text-xs text-textMuted">
          Click to select · Del remove · Ctrl+Z undo · Ctrl+Y redo
        </div>
      </div>
    </div>
  )
}