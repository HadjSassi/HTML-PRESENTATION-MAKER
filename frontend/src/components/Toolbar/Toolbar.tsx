import { v4 as uuid } from 'uuid'
import { useState } from 'react'
import { Type, Image, Video, Shapes, PenLine, Waypoints } from 'lucide-react'
import { useCanvasCtx } from '../../contexts/CanvasContext'
import { fabric } from 'fabric'
import { fileToDataUrl } from '../../utils/fileUtils'
import { inverseHexColor } from '../../utils/colorUtils'
import { usePresentationStore } from '../../store/usePresentationStore'
import { createShape, SHAPE_OPTIONS, type ShapeType } from '../../utils/shapeFactory'
import { VideoSourceModal } from './VideoSourceModal'

function addText(canvas: fabric.Canvas) {
  const bg = typeof canvas.backgroundColor === 'string' ? canvas.backgroundColor : '#ffffff'
  const saved = usePresentationStore.getState().lastSelectedTextColor
  const text = new fabric.IText('Double-click to edit', {
    left: 100, top: 100, fontSize: 32, fill: saved ?? inverseHexColor(bg),
    fontFamily: 'Arial', id: uuid(),
  } as fabric.ITextOptions & { id: string })
  canvas.add(text)
  canvas.setActiveObject(text)
  canvas.renderAll()
  text.enterEditing()
}

async function addImage(canvas: fabric.Canvas) {
  const input = document.createElement('input')
  input.type = 'file'; input.accept = 'image/*'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const dataUrl = await fileToDataUrl(file)
    fabric.Image.fromURL(dataUrl, (img) => {
      const scale = Math.min(400 / (img.width ?? 400), 300 / (img.height ?? 300))
      img.set({ left: 100, top: 100, scaleX: scale, scaleY: scale, id: uuid() } as any)
      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()
    })
  }
  input.click()
}

function addVideo(canvas: fabric.Canvas, src: string, videoType: 'embed' | 'local') {
  const rect = new fabric.Rect({
    left: 80, top: 100, width: 400, height: 250,
    fill: '#0d0d1a', stroke: '#8b5cf6', strokeWidth: 2, rx: 4, ry: 4,
    id: uuid(), customType: 'video', videoSrc: src, videoType,
  } as fabric.IRectOptions & { id: string; customType: string; videoSrc: string; videoType: string })
  const label = new fabric.IText('🎬 Video', {
    left: 280, top: 225, fontSize: 18, fill: '#8b5cf6',
    originX: 'center', originY: 'center', selectable: false,
  } as any)
  canvas.add(rect, label)
  canvas.setActiveObject(rect)
  canvas.renderAll()
}

interface ToolItem {
  icon: React.ReactNode
  label: string
  action: (c: fabric.Canvas) => void
}

const TOOLS: ToolItem[] = [
  { icon: <Type size={18} />,     label: 'Text',      action: addText },
  { icon: <Image size={18} />,    label: 'Image',     action: addImage },
]

function addShape(canvas: fabric.Canvas, shapeType: ShapeType) {
  const style = usePresentationStore.getState().shapeStyle
  const shape = createShape(shapeType, style)
  canvas.add(shape)
  canvas.setActiveObject(shape)
  canvas.renderAll()
}

export function Toolbar() {
  const { canvasRef } = useCanvasCtx()
  const { shapeDrawMode, setShapeDrawMode } = usePresentationStore()
  const [shapesOpen, setShapesOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <div className="flex items-center h-10 px-3 bg-panel border-b border-border shrink-0 gap-1">
      <span className="text-xs text-textMuted mr-2 uppercase tracking-wider">Insert</span>
      {TOOLS.map((tool) => (
        <button
          key={tool.label}
          title={tool.label}
          onClick={() => canvasRef.current && tool.action(canvasRef.current)}
          className="flex items-center gap-1.5 px-3 py-1 rounded text-textSecondary
            hover:text-textPrimary hover:bg-hover transition-colors text-sm"
        >
          {tool.icon}
          <span className="hidden md:inline">{tool.label}</span>
        </button>
      ))}
      <button
        title="Video"
        onClick={() => setVideoOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1 rounded text-textSecondary
          hover:text-textPrimary hover:bg-hover transition-colors text-sm"
      >
        <Video size={18} />
        <span className="hidden md:inline">Video</span>
      </button>
      <div className="relative">
        <button
          title="Shapes"
          onClick={() => setShapesOpen((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1 rounded text-textSecondary
            hover:text-textPrimary hover:bg-hover transition-colors text-sm"
        >
          <Shapes size={18} />
          <span className="hidden md:inline">Shapes</span>
        </button>
        {shapesOpen && (
          <div className="absolute top-full left-0 mt-1 w-56 bg-panel border border-border rounded-lg shadow-lg p-2 z-10">
            <div className="text-[11px] text-textMuted uppercase tracking-wider px-2 py-1">Basic Shapes</div>
            <div className="grid grid-cols-2 gap-1">
              {SHAPE_OPTIONS.map((shape) => (
                <button
                  key={shape.value}
                  onClick={() => {
                    const canvas = canvasRef.current
                    if (!canvas) return
                    setShapeDrawMode('none')
                    addShape(canvas, shape.value)
                    setShapesOpen(false)
                  }}
                  className="text-xs text-left px-2 py-1.5 rounded hover:bg-hover text-textSecondary hover:text-textPrimary"
                >
                  {shape.label}
                </button>
              ))}
            </div>
            <div className="h-px bg-border my-2" />
            <div className="text-[11px] text-textMuted uppercase tracking-wider px-2 py-1">Custom Draw</div>
            <button
              onClick={() => { setShapeDrawMode('free'); setShapesOpen(false) }}
              className="w-full text-xs text-left px-2 py-1.5 rounded hover:bg-hover text-textSecondary hover:text-textPrimary flex items-center gap-2"
            >
              <PenLine size={14} /> Free Draw
            </button>
            <button
              onClick={() => { setShapeDrawMode('polygon'); setShapesOpen(false) }}
              className="w-full text-xs text-left px-2 py-1.5 rounded hover:bg-hover text-textSecondary hover:text-textPrimary flex items-center gap-2"
            >
              <Waypoints size={14} /> Draw by Points
            </button>
            {shapeDrawMode !== 'none' && (
              <button
                onClick={() => { setShapeDrawMode('none'); setShapesOpen(false) }}
                className="w-full mt-2 text-xs px-2 py-1.5 rounded bg-hover text-textPrimary"
              >
                Stop Draw Mode
              </button>
            )}
          </div>
        )}
      </div>
      {shapeDrawMode !== 'none' && (
        <span className="ml-1 text-xs px-2 py-0.5 rounded bg-accent/20 text-accent">
          {shapeDrawMode === 'free' ? 'Free Draw Active' : 'Point Draw Active'}
        </span>
      )}
      <VideoSourceModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        onSubmit={(src, videoType) => {
          const canvas = canvasRef.current
          if (!canvas) return
          addVideo(canvas, src, videoType)
        }}
      />
    </div>
  )
}

