import { usePresentationStore } from '../../store/usePresentationStore'
import { useCanvasCtx } from '../../contexts/CanvasContext'
import { SlideProperties } from './SlideProperties'
import { TextProperties } from './TextProperties'
import { ImageProperties, VideoProperties } from './ImageProperties'
import { ShapeProperties } from './ShapeProperties'
import { ObjectArrangeProperties } from './ObjectArrangeProperties'
import { fabric } from 'fabric'

function NoSelection() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center text-2xl">🖱️</div>
      <p className="text-sm text-textSecondary">Click an element on the canvas to edit its properties</p>
    </div>
  )
}

export function PropertiesPanel() {
  const { selectedObjectId } = usePresentationStore()
  const { canvasRef } = useCanvasCtx()
  const canvas = canvasRef.current
  const active = canvas?.getActiveObject()

  let content: React.ReactNode = null

  if (!selectedObjectId || !active) {
    content = (
      <>
        <SlideProperties />
        <div className="h-px bg-border mx-4" />
        <NoSelection />
      </>
    )
  } else {
    const type = (active as any).type
    const customType = (active as any).customType

    if (type === 'i-text' || type === 'text') {
      content = (
        <>
          <TextProperties obj={active as fabric.IText} canvas={canvas!} />
          <ObjectArrangeProperties canvas={canvas!} />
        </>
      )
    } else if (type === 'image') {
      content = (
        <>
          <ImageProperties obj={active as fabric.Image} canvas={canvas!} />
          <ObjectArrangeProperties canvas={canvas!} />
        </>
      )
    } else if (customType === 'video') {
      content = (
        <>
          <VideoProperties obj={active} canvas={canvas!} />
          <ObjectArrangeProperties canvas={canvas!} />
        </>
      )
    } else {
      content = (
        <>
          <ShapeProperties obj={active as fabric.Object} canvas={canvas!} />
          <ObjectArrangeProperties canvas={canvas!} />
        </>
      )
    }
  }

  return (
    <aside className="w-64 shrink-0 bg-panel border-l border-border flex flex-col overflow-y-auto custom-scrollbar">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Properties</h2>
      </div>
      {content}
    </aside>
  )
}

