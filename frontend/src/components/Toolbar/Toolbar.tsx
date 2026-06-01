import { v4 as uuid } from 'uuid'
import { Type, Image, Video, Square, Minus, AlignLeft } from 'lucide-react'
import { useCanvasCtx } from '../../contexts/CanvasContext'
import { fabric } from 'fabric'
import { fileToDataUrl } from '../../utils/fileUtils'

function addText(canvas: fabric.Canvas) {
  const text = new fabric.IText('Double-click to edit', {
    left: 100, top: 100, fontSize: 32, fill: '#ffffff',
    fontFamily: 'Arial', id: uuid(),
  } as fabric.ITextOptions & { id: string })
  canvas.add(text)
  canvas.setActiveObject(text)
  canvas.renderAll()
  text.enterEditing()
}

function addRect(canvas: fabric.Canvas) {
  const rect = new fabric.Rect({
    left: 150, top: 150, width: 200, height: 120,
    fill: '#8b5cf6', rx: 8, ry: 8, id: uuid(),
  } as fabric.IRectOptions & { id: string })
  canvas.add(rect)
  canvas.setActiveObject(rect)
  canvas.renderAll()
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

function addVideo(canvas: fabric.Canvas) {
  const url = prompt('Paste video URL (mp4, YouTube embed, etc.):')
  if (!url) return
  const rect = new fabric.Rect({
    left: 80, top: 100, width: 400, height: 250,
    fill: '#0d0d1a', stroke: '#8b5cf6', strokeWidth: 2, rx: 4, ry: 4,
    id: uuid(), customType: 'video', videoSrc: url,
  } as fabric.IRectOptions & { id: string; customType: string; videoSrc: string })
  const label = new fabric.IText('🎬 Video', {
    left: 280, top: 225, fontSize: 18, fill: '#8b5cf6',
    originX: 'center', originY: 'center', selectable: false,
  } as any)
  canvas.add(rect, label)
  canvas.setActiveObject(rect)
  canvas.renderAll()
}

function addLine(canvas: fabric.Canvas) {
  const line = new fabric.Line([50, 50, 500, 50], {
    stroke: '#8b5cf6', strokeWidth: 3, id: uuid(),
  } as fabric.ILineOptions & { id: string })
  canvas.add(line)
  canvas.setActiveObject(line)
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
  { icon: <Video size={18} />,    label: 'Video',     action: addVideo },
  { icon: <Square size={18} />,   label: 'Rectangle', action: addRect },
  { icon: <Minus size={18} />,    label: 'Line',      action: addLine },
]

export function Toolbar() {
  const { canvasRef } = useCanvasCtx()

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
    </div>
  )
}

