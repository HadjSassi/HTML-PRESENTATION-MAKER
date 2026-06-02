import { useState } from 'react'
import { Modal } from '../UI/Modal'
import { Button } from '../UI/Button'
import { Input } from '../UI/Input'
import { fileToDataUrl } from '../../utils/fileUtils'

type Mode = 'embed' | 'local'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (src: string, videoType: Mode) => void
}

export function VideoSourceModal({ open, onClose, onSubmit }: Props) {
  const [mode, setMode] = useState<Mode>('embed')
  const [embedUrl, setEmbedUrl] = useState('')
  const [localFile, setLocalFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (mode === 'embed') {
      if (!embedUrl.trim()) return
      onSubmit(embedUrl.trim(), 'embed')
      setEmbedUrl('')
      onClose()
      return
    }
    if (!localFile) return
    setLoading(true)
    const dataUrl = await fileToDataUrl(localFile)
    setLoading(false)
    onSubmit(dataUrl, 'local')
    setLocalFile(null)
    onClose()
  }

  return (
    <Modal open={open} title="Add Video" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('embed')}
            className={`px-3 py-1.5 rounded text-xs border ${mode === 'embed'
              ? 'bg-accent/15 border-accent text-accent'
              : 'bg-card border-border text-textSecondary hover:text-textPrimary'}`}
          >
            Embedded Video
          </button>
          <button
            onClick={() => setMode('local')}
            className={`px-3 py-1.5 rounded text-xs border ${mode === 'local'
              ? 'bg-accent/15 border-accent text-accent'
              : 'bg-card border-border text-textSecondary hover:text-textPrimary'}`}
          >
            Local Video
          </button>
        </div>

        {mode === 'embed' ? (
          <Input
            label="Video URL"
            placeholder="https://..."
            value={embedUrl}
            onChange={(e) => setEmbedUrl(e.target.value)}
          />
        ) : (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-textSecondary font-medium">Local Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setLocalFile(e.target.files?.[0] ?? null)}
              className="w-full bg-card border border-border rounded px-2.5 py-2 text-xs text-textPrimary"
            />
            <span className="text-[11px] text-textMuted">The file is embedded in the project.</span>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button size="sm" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button size="sm" variant="primary" onClick={submit} disabled={loading}>
            {loading ? 'Loading...' : 'Insert Video'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

