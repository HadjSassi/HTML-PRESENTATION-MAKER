import { useEffect, useRef, type RefObject } from 'react'
import { fabric } from 'fabric'
import { usePresentationStore } from '../store/usePresentationStore'

const CANVAS_W = 960
const CANVAS_H = 540

export function useFabricCanvas(
  elRef: RefObject<HTMLCanvasElement | null>
): RefObject<fabric.Canvas | null> {
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const { presentation, currentSlideIndex, updateCanvas, setSelectedObjectId, setLastSelectedTextColor } =
    usePresentationStore()

  // Init canvas once
  useEffect(() => {
    if (!elRef.current || fabricRef.current) return
    const canvas = new fabric.Canvas(elRef.current, {
      width: CANVAS_W, height: CANVAS_H,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    })
    fabricRef.current = canvas

    const sync = () => {
      const json = JSON.stringify(canvas.toJSON(['id', 'customType', 'videoSrc']))
      const thumb = canvas.toDataURL({ format: 'png', quality: 0.4, multiplier: 0.25 })
      updateCanvas(
        usePresentationStore.getState().currentSlideIndex, json, thumb
      )
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
    })
    canvas.on('selection:updated', (e) => {
      const obj = e.selected?.[0] as fabric.Object & { id?: string }
      setSelectedObjectId(obj?.id ?? obj?.type ?? null)
      if (obj?.type === 'i-text' && typeof (obj as fabric.IText).fill === 'string') {
        setLastSelectedTextColor((obj as fabric.IText).fill as string)
      }
    })
    canvas.on('selection:cleared', () => setSelectedObjectId(null))

    return () => { canvas.dispose(); fabricRef.current = null }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elRef])

  // Load slide on index change
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    const slide = presentation.slides[currentSlideIndex]
    if (!slide) return

    const load = async () => {
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
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlideIndex])

  return fabricRef
}

