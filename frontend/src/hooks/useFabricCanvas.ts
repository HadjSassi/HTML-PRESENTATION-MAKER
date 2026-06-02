import { useEffect, useRef, type RefObject } from 'react'
import { fabric } from 'fabric'
import { v4 as uuid } from 'uuid'
import { usePresentationStore } from '../store/usePresentationStore'

const CANVAS_W = 960
const CANVAS_H = 540
const SERIALIZE_PROPS = ['id', 'customType', 'videoSrc', 'videoType', 'shapeType']

export function useFabricCanvas(
  elRef: RefObject<HTMLCanvasElement | null>
): RefObject<fabric.Canvas | null> {
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const polyPoints = useRef<fabric.Point[]>([])
  const polyGuides = useRef<fabric.Object[]>([])
  const polyLiveLine = useRef<fabric.Line | null>(null)
  const undoStack = useRef<string[]>([])
  const redoStack = useRef<string[]>([])
  const isApplyingHistory = useRef(false)
  const isLoadingSlide = useRef(false)
  const {
    presentation,
    currentSlideIndex,
    updateCanvas,
    setSelectedObjectId,
    setLastSelectedTextColor,
    shapeDrawMode,
    shapeStyle,
    setShapeStyle,
    setShapeDrawMode,
  } =
    usePresentationStore()

  const isShapeObject = (obj: fabric.Object | undefined) => {
    if (!obj) return false
    const customType = (obj as any).customType
    if (customType === 'shape') return true
    return ['rect', 'line', 'circle', 'ellipse', 'triangle', 'polygon', 'path'].includes(obj.type ?? '')
  }

  // Init canvas once
  useEffect(() => {
    if (!elRef.current || fabricRef.current) return
    const canvas = new fabric.Canvas(elRef.current, {
      width: CANVAS_W, height: CANVAS_H,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    })
    fabricRef.current = canvas

    const snapshot = () => JSON.stringify(canvas.toJSON(SERIALIZE_PROPS))
    const persist = () => {
      const json = snapshot()
      const thumb = canvas.toDataURL({ format: 'png', quality: 0.4, multiplier: 0.25 })
      updateCanvas(usePresentationStore.getState().currentSlideIndex, json, thumb)
    }
    const pushHistory = (json: string) => {
      if (isApplyingHistory.current || isLoadingSlide.current) return
      if (undoStack.current[undoStack.current.length - 1] === json) return
      undoStack.current.push(json)
      if (undoStack.current.length > 100) undoStack.current.shift()
      redoStack.current = []
    }
    const applySnapshot = (json: string) => {
      isApplyingHistory.current = true
      canvas.loadFromJSON(json, () => {
        canvas.renderAll()
        persist()
        isApplyingHistory.current = false
      })
    }
    ;(canvas as any).hpmUndo = () => {
      if (undoStack.current.length < 2) return
      const current = undoStack.current.pop()
      if (current) redoStack.current.push(current)
      const prev = undoStack.current[undoStack.current.length - 1]
      if (prev) applySnapshot(prev)
    }
    ;(canvas as any).hpmRedo = () => {
      const next = redoStack.current.pop()
      if (!next) return
      undoStack.current.push(next)
      applySnapshot(next)
    }

    const sync = (evt?: fabric.IEvent) => {
      if ((evt?.target as any)?.customType === 'shape-guide') return
      const json = snapshot()
      pushHistory(json)
      persist()
    }
    canvas.on('object:modified', sync)
    canvas.on('object:added', sync)
    canvas.on('object:removed', sync)
    canvas.on('selection:created', (e) => {
      const obj = e.selected?.[0] as fabric.Object & { id?: string }
      setSelectedObjectId(obj?.id ?? obj?.type ?? null)
      if (obj?.type === 'i-text' && typeof (obj as fabric.IText).fill === 'string') {
        setLastSelectedTextColor((obj as fabric.IText).fill as string)
      }
      if (isShapeObject(obj)) {
        setShapeStyle({
          fill: typeof obj.fill === 'string' ? obj.fill : shapeStyle.fill,
          stroke: typeof obj.stroke === 'string' ? obj.stroke : shapeStyle.stroke,
          strokeWidth: Number(obj.strokeWidth ?? shapeStyle.strokeWidth),
          opacity: Number(obj.opacity ?? shapeStyle.opacity),
        })
      }
    })
    canvas.on('selection:updated', (e) => {
      const obj = e.selected?.[0] as fabric.Object & { id?: string }
      setSelectedObjectId(obj?.id ?? obj?.type ?? null)
      if (obj?.type === 'i-text' && typeof (obj as fabric.IText).fill === 'string') {
        setLastSelectedTextColor((obj as fabric.IText).fill as string)
      }
      if (isShapeObject(obj)) {
        setShapeStyle({
          fill: typeof obj.fill === 'string' ? obj.fill : shapeStyle.fill,
          stroke: typeof obj.stroke === 'string' ? obj.stroke : shapeStyle.stroke,
          strokeWidth: Number(obj.strokeWidth ?? shapeStyle.strokeWidth),
          opacity: Number(obj.opacity ?? shapeStyle.opacity),
        })
      }
    })
    canvas.on('selection:cleared', () => setSelectedObjectId(null))
    undoStack.current = [snapshot()]
    redoStack.current = []

    return () => { canvas.dispose(); fabricRef.current = null }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elRef])

  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    const clearPoly = () => {
      polyGuides.current.forEach((obj) => canvas.remove(obj))
      polyGuides.current = []
      if (polyLiveLine.current) canvas.remove(polyLiveLine.current)
      polyLiveLine.current = null
      polyPoints.current = []
      canvas.renderAll()
    }

    if (shapeDrawMode === 'free') {
      clearPoly()
      canvas.isDrawingMode = true
      const brush = canvas.freeDrawingBrush ?? new fabric.PencilBrush(canvas)
      brush.color = shapeStyle.stroke
      brush.width = shapeStyle.strokeWidth
      canvas.freeDrawingBrush = brush
      const onPath = (e: fabric.IEvent) => {
        const path = (e as any).path as fabric.Path | undefined
        if (!path) return
        path.set({
          id: uuid(),
          customType: 'shape',
          shapeType: 'free-path',
          fill: '',
          stroke: shapeStyle.stroke,
          strokeWidth: shapeStyle.strokeWidth,
          opacity: shapeStyle.opacity,
        } as any)
        canvas.setActiveObject(path)
      }
      canvas.on('path:created', onPath)
      return () => {
        canvas.off('path:created', onPath)
        canvas.isDrawingMode = false
      }
    }

    canvas.isDrawingMode = false

    if (shapeDrawMode !== 'polygon') {
      clearPoly()
      return
    }

    const nearFirst = (p: fabric.Point) => {
      if (!polyPoints.current.length) return false
      const f = polyPoints.current[0]
      return Math.hypot(p.x - f.x, p.y - f.y) < 12
    }

    const finishPolygon = () => {
      if (polyPoints.current.length < 3) return
      const shape = new fabric.Polygon(
        polyPoints.current.map((p) => ({ x: p.x, y: p.y })),
        {
          id: uuid(),
          customType: 'shape',
          shapeType: 'custom-polygon',
          fill: shapeStyle.fill,
          stroke: shapeStyle.stroke,
          strokeWidth: shapeStyle.strokeWidth,
          opacity: shapeStyle.opacity,
        } as any
      )
      clearPoly()
      canvas.add(shape)
      canvas.setActiveObject(shape)
      canvas.renderAll()
      setShapeDrawMode('none')
    }

    const onDown = (evt: fabric.IEvent<Event>) => {
      const p = canvas.getPointer(evt.e)
      const point = new fabric.Point(p.x, p.y)

      if (polyPoints.current.length >= 3 && nearFirst(point)) {
        finishPolygon()
        return
      }

      const dot = new fabric.Circle({
        left: point.x - 4,
        top: point.y - 4,
        radius: 4,
        fill: shapeStyle.stroke,
        selectable: false,
        evented: false,
        customType: 'shape-guide',
        excludeFromExport: true,
      } as any)
      polyGuides.current.push(dot)
      canvas.add(dot)

      const prev = polyPoints.current[polyPoints.current.length - 1]
      if (prev) {
        const line = new fabric.Line([prev.x, prev.y, point.x, point.y], {
          stroke: shapeStyle.stroke,
          strokeWidth: 1,
          selectable: false,
          evented: false,
          strokeDashArray: [4, 4],
          customType: 'shape-guide',
          excludeFromExport: true,
        } as any)
        polyGuides.current.push(line)
        canvas.add(line)
      }

      polyPoints.current.push(point)
      canvas.renderAll()
    }

    const onMove = (evt: fabric.IEvent<Event>) => {
      const last = polyPoints.current[polyPoints.current.length - 1]
      if (!last) return
      const p = canvas.getPointer(evt.e)
      if (!polyLiveLine.current) {
        polyLiveLine.current = new fabric.Line([last.x, last.y, p.x, p.y], {
          stroke: shapeStyle.stroke,
          strokeWidth: 1,
          selectable: false,
          evented: false,
          strokeDashArray: [3, 3],
          customType: 'shape-guide',
          excludeFromExport: true,
        } as any)
        canvas.add(polyLiveLine.current)
      } else {
        polyLiveLine.current.set({ x1: last.x, y1: last.y, x2: p.x, y2: p.y })
      }
      canvas.renderAll()
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearPoly()
        setShapeDrawMode('none')
      }
    }

    canvas.on('mouse:down', onDown)
    canvas.on('mouse:move', onMove)
    window.addEventListener('keydown', onKey)

    return () => {
      canvas.off('mouse:down', onDown)
      canvas.off('mouse:move', onMove)
      window.removeEventListener('keydown', onKey)
      clearPoly()
    }
  }, [shapeDrawMode, shapeStyle, setShapeDrawMode])

  // Load slide on index change
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    const slide = presentation.slides[currentSlideIndex]
    if (!slide) return

    const load = async () => {
      isLoadingSlide.current = true
      if (slide.canvasJson && slide.canvasJson !== '{}') {
        await new Promise<void>((res) =>
          canvas.loadFromJSON(slide.canvasJson, () => {
            canvas.backgroundColor = slide.backgroundColor
            canvas.renderAll()
            res()
          })
        )
      } else {
        canvas.clear()
        canvas.backgroundColor = slide.backgroundColor
        canvas.renderAll()
      }
      const json = JSON.stringify(canvas.toJSON(SERIALIZE_PROPS))
      undoStack.current = [json]
      redoStack.current = []
      isLoadingSlide.current = false
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlideIndex])

  return fabricRef
}

