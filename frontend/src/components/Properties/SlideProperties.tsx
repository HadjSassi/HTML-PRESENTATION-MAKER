import { useCanvasCtx } from '../../contexts/CanvasContext'
import { usePresentationStore } from '../../store/usePresentationStore'
import { ColorPicker } from '../UI/ColorPicker'
import { Select } from '../UI/Select'
import { Slider } from '../UI/Select'
import { ANIMATION_OPTIONS } from '../../types'
import type { Animation } from '../../types'

export function SlideProperties() {
  const { presentation, currentSlideIndex, updateSlideBackground, updateSlideAnimation, updateSlideTitle, updateCanvas } =
    usePresentationStore()
  const { canvasRef } = useCanvasCtx()
  const slide = presentation.slides[currentSlideIndex]
  if (!slide) return null

  const handleBgChange = (color: string) => {
    updateSlideBackground(currentSlideIndex, color)
    if (canvasRef.current) {
      canvasRef.current.backgroundColor = color
      canvasRef.current.renderAll()
      const json = JSON.stringify(canvasRef.current.toJSON(['id', 'customType', 'videoSrc']))
      const thumb = canvasRef.current.toDataURL({ format: 'png', quality: 0.4, multiplier: 0.25 })
      updateCanvas(currentSlideIndex, json, thumb)
    }
  }

  const handleAnimChange = (key: keyof Animation, value: string | number) => {
    updateSlideAnimation(currentSlideIndex, { ...slide.animation, [key]: value })
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3">
          Slide
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-textSecondary font-medium">Title</label>
            <input
              value={slide.title}
              onChange={(e) => updateSlideTitle(currentSlideIndex, e.target.value)}
              className="w-full bg-card border border-border rounded px-2.5 py-1.5 text-sm
                text-textPrimary focus:outline-none focus:border-accent"
            />
          </div>
          <ColorPicker label="Background" value={slide.backgroundColor} onChange={handleBgChange} />
        </div>
      </div>

      <div className="h-px bg-border" />

      <div>
        <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3">
          Entry Animation
        </h3>
        <div className="flex flex-col gap-3">
          <Select
            label="Effect"
            value={slide.animation.type}
            onChange={(v) => handleAnimChange('type', v)}
            options={ANIMATION_OPTIONS}
          />
          <Slider
            label={`Duration: ${slide.animation.duration}s`}
            value={slide.animation.duration}
            onChange={(v) => handleAnimChange('duration', v)}
            min={0.1} max={2} step={0.1}
          />
        </div>
      </div>
    </div>
  )
}

