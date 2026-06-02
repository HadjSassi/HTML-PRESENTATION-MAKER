import { type fabric } from 'fabric'
import { ColorPicker } from '../UI/ColorPicker'
import { Select } from '../UI/Select'
import { NumberInput } from '../UI/Input'
import { FONT_FAMILIES, FONT_SIZES, TEXT_ALIGNS } from '../../utils/constants'
import { usePresentationStore } from '../../store/usePresentationStore'
import { LinkProperties } from './LinkProperties'

interface Props { obj: fabric.IText; canvas: fabric.Canvas }

export function TextProperties({ obj, canvas }: Props) {
  const { setLastSelectedTextColor } = usePresentationStore()
  
  const update = (props: Partial<fabric.IText>) => {
    obj.set(props)
    // Manually fire the modified event to trigger a save
    canvas.fire('object:modified', { target: obj })
    canvas.renderAll()
  }

  const pos = obj.getBoundingRect()

  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3">Text</h3>
        <div className="flex flex-col gap-3">
          <Select label="Font Family" value={obj.fontFamily ?? 'Arial'}
            onChange={(v) => update({ fontFamily: v })}
            options={FONT_FAMILIES.map((f) => ({ value: f, label: f }))} />
          <Select label="Font Size" value={String(obj.fontSize ?? 24)}
            onChange={(v) => update({ fontSize: Number(v) })}
            options={FONT_SIZES.map((s) => ({ value: String(s), label: `${s}px` }))} />
          <ColorPicker
            label="Color"
            value={(obj.fill as string) ?? '#ffffff'}
            onChange={(v) => {
              update({ fill: v })
              setLastSelectedTextColor(v)
            }}
          />
          <Select label="Align" value={obj.textAlign ?? 'left'}
            onChange={(v) => update({ textAlign: v as any })}
            options={TEXT_ALIGNS.map((a) => ({ value: a, label: a.charAt(0).toUpperCase() + a.slice(1) }))} />
          <div className="flex gap-2">
            {(['bold', 'italic', 'underline'] as const).map((style) => (
              <button key={style}
                onClick={() => update({
                  fontWeight: style === 'bold' ? (obj.fontWeight === 'bold' ? 'normal' : 'bold') : obj.fontWeight,
                  fontStyle: style === 'italic' ? (obj.fontStyle === 'italic' ? 'normal' : 'italic') : obj.fontStyle,
                  underline: style === 'underline' ? !obj.underline : obj.underline,
                } as any)}
                className={`flex-1 py-1 rounded border text-xs font-medium capitalize
                  transition-colors ${(obj as any)[style === 'bold' ? 'fontWeight' : style === 'italic' ? 'fontStyle' : 'underline'] === (style === 'bold' ? 'bold' : style === 'italic' ? 'italic' : true)
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-border text-textSecondary hover:border-borderActive'}`}>
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-px bg-border" />
      <div>
        <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3">Position</h3>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput label="X" value={Math.round(obj.left ?? 0)} onChange={(v) => update({ left: v })} />
          <NumberInput label="Y" value={Math.round(obj.top ?? 0)} onChange={(v) => update({ top: v })} />
          <NumberInput label="W" value={Math.round(pos.width)} onChange={() => {}} min={10} />
          <NumberInput label="H" value={Math.round(pos.height)} onChange={() => {}} min={10} />
        </div>
      </div>
      <div className="h-px bg-border" />
      <LinkProperties obj={obj} canvas={canvas} />
    </div>
  )
}