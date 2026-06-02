import { usePresentationStore } from '../../store/usePresentationStore'
import { fabric } from 'fabric'

interface LinkPropertiesProps {
  obj: fabric.Object
  canvas: fabric.Canvas
}

export function LinkProperties({ obj, canvas }: LinkPropertiesProps) {
  const { presentation } = usePresentationStore()
  const slides = presentation.slides

  const getLinkedSlideId = () => {
    return (obj as any).linkedSlideId || ''
  }

  const setLinkedSlideId = (slideId: string) => {
    // Directly set the property on the object
    obj.set('linkedSlideId', slideId || undefined)
    // Manually fire the modified event to trigger a save
    canvas.fire('object:modified', { target: obj })
    canvas.renderAll()
  }

  return (
    <div className="px-4 py-3">
      <label className="text-xs text-textSecondary">Link to Slide</label>
      <select
        className="w-full mt-1 px-2 py-1.5 bg-input border border-border rounded-md text-sm"
        value={getLinkedSlideId()}
        onChange={(e) => setLinkedSlideId(e.target.value)}
      >
        <option value="">None</option>
        {slides.map((slide) => (
          <option key={slide.id} value={slide.id}>
            {slide.title}
          </option>
        ))}
      </select>
    </div>
  )
}