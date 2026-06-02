import { useRef } from 'react'
import { Eye, Save, Download, Upload, RotateCcw, Settings } from 'lucide-react'
import { usePresentationStore } from '../../store/usePresentationStore'
import { Button } from '../UI/Button'
import { exportHpm, importHpm } from '../../utils/fileUtils'
import { APP_NAME, APP_AUTHOR } from '../../utils/constants'
import { SettingsModal } from './SettingsModal'
import { useState } from 'react'

export function Header() {
  const { presentation, isDirty, setPresentationInfo, togglePreview, reset } =
    usePresentationStore()
  const importRef = useRef<HTMLInputElement>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const load = usePresentationStore((s) => s.load)

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const p = await importHpm(file)
      load(p)
    } catch { alert('Invalid .hpm file') }
    e.target.value = ''
  }

  return (
    <header className="flex items-center h-12 px-4 bg-panel border-b border-border shrink-0 gap-3">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-2">
        <span className="text-xl">🎨</span>
        <div className="hidden sm:flex flex-col leading-none">
          <span className="text-xs font-bold text-textPrimary">{APP_NAME}</span>
          <span className="text-[10px] text-textMuted">by {APP_AUTHOR}</span>
        </div>
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Presentation title */}
      <input
        value={presentation.title}
        onChange={(e) => setPresentationInfo({ title: e.target.value })}
        className="bg-transparent text-textPrimary text-sm font-medium w-44
          focus:outline-none focus:bg-card focus:px-2 rounded transition-all"
        placeholder="Presentation title"
      />

      {isDirty && <span className="w-1.5 h-1.5 rounded-full bg-warning shrink-0" title="Unsaved changes" />}

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="sm" icon={<RotateCcw size={14} />}
          onClick={() => confirm('Start a new presentation?') && reset()}>
          New
        </Button>

        <input ref={importRef} type="file" accept=".hpm,.json" className="hidden" onChange={handleImport} />
        <Button variant="ghost" size="sm" icon={<Upload size={14} />}
          onClick={() => importRef.current?.click()}>
          Open
        </Button>

        <Button variant="secondary" size="sm" icon={<Save size={14} />}
          onClick={() => exportHpm(presentation)}>
          Save
        </Button>

        <Button variant="secondary" size="sm" icon={<Download size={14} />}
          onClick={() => exportHpm(presentation)}>
          Export
        </Button>

        <Button variant="primary" size="sm" icon={<Eye size={14} />}
          onClick={togglePreview}>
          Preview
        </Button>

        <Button variant="ghost" size="sm" icon={<Settings size={14} />}
          onClick={() => setSettingsOpen(true)}>
          Settings
        </Button>
      </div>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </header>
  )
}

