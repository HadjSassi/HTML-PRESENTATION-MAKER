import { type fabric } from 'fabric'
import { NumberInput } from '../UI/Input'
import { Select } from '../UI/Select'
import { ColorPicker } from '../UI/ColorPicker'

interface ImageProps { obj: fabric.Image; canvas: fabric.Canvas }

export function ImageProperties({ obj, canvas }: ImageProps) {
  const rect = obj.getBoundingRect()
  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3">Image</h3>
        <div className="flex flex-col gap-3">
          <div className="bg-card rounded-lg p-2 text-xs text-textMuted text-center">
            {Math.round(rect.width)} × {Math.round(rect.height)} px
          </div>
          <Select label="Object Fit"
            value={(obj as any).objectFit ?? 'contain'}
            onChange={(v) => { (obj as any).objectFit = v; canvas.renderAll() }}
            options={['contain', 'cover', 'fill', 'none'].map((v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }))} />
        </div>
      </div>
      <div className="h-px bg-border" />
      <div>
        <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3">Position & Size</h3>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput label="X" value={Math.round(obj.left ?? 0)} onChange={(v) => { obj.set({ left: v }); canvas.renderAll() }} />
          <NumberInput label="Y" value={Math.round(obj.top ?? 0)} onChange={(v) => { obj.set({ top: v }); canvas.renderAll() }} />
          <NumberInput label="Scale X" value={Number((obj.scaleX ?? 1).toFixed(2))} onChange={(v) => { obj.set({ scaleX: v }); canvas.renderAll() }} step={0.01} min={0.01} />
          <NumberInput label="Scale Y" value={Number((obj.scaleY ?? 1).toFixed(2))} onChange={(v) => { obj.set({ scaleY: v }); canvas.renderAll() }} step={0.01} min={0.01} />
        </div>
      </div>
      <div className="h-px bg-border" />
      <div>
        <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3">Opacity</h3>
        <input type="range" min={0} max={1} step={0.01} value={obj.opacity ?? 1}
          onChange={(e) => { obj.set({ opacity: Number(e.target.value) }); canvas.renderAll() }}
          className="w-full accent-accent" />
      </div>
    </div>
  )
}

interface VideoProps { obj: fabric.Object; canvas: fabric.Canvas }

export function VideoProperties({ obj, canvas }: VideoProps) {
  const src = (obj as any).videoSrc ?? ''
  const videoType = ((obj as any).videoType ?? 'embed') as 'embed' | 'local'
  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3">Video</h3>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-textSecondary font-medium">Source Type</label>
            <select
              value={videoType}
              onChange={(e) => { (obj as any).videoType = e.target.value; canvas.renderAll() }}
              className="w-full bg-card border border-border rounded px-2.5 py-1.5 text-xs text-textPrimary"
            >
              <option value="embed">Embedded URL</option>
              <option value="local">Local Video</option>
            </select>
          </div>
          {videoType === 'embed' ? (
            <div>
              <label className="text-xs text-textSecondary font-medium mb-1 block">Source URL</label>
              <input value={src}
                onChange={(e) => { (obj as any).videoSrc = e.target.value; canvas.renderAll() }}
                className="w-full bg-card border border-border rounded px-2.5 py-1.5 text-xs
                  text-textPrimary focus:outline-none focus:border-accent"
                placeholder="https://..." />
            </div>
          ) : (
            <div className="bg-card rounded p-2 text-xs text-textMuted break-all">
              Local video is embedded in project data.
            </div>
          )}
          <ColorPicker label="Border Color" value={(obj as any).stroke ?? '#8b5cf6'}
            onChange={(v) => { obj.set({ stroke: v }); canvas.renderAll() }} />
        </div>
      </div>
      <div className="h-px bg-border" />
      <div>
        <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3">Position</h3>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput label="X" value={Math.round(obj.left ?? 0)} onChange={(v) => { obj.set({ left: v }); canvas.renderAll() }} />
          <NumberInput label="Y" value={Math.round(obj.top ?? 0)} onChange={(v) => { obj.set({ top: v }); canvas.renderAll() }} />
          <NumberInput label="Width" value={Math.round(obj.width ?? 0)} onChange={(v) => { obj.set({ width: v }); canvas.renderAll() }} />
          <NumberInput label="Height" value={Math.round(obj.height ?? 0)} onChange={(v) => { obj.set({ height: v }); canvas.renderAll() }} />
        </div>
      </div>
    </div>
  )
}

