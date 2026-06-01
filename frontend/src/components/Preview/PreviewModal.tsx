import { useEffect, useRef, useState } from 'react'
import { X, Maximize2, Download } from 'lucide-react'
import { usePresentationStore } from '../../store/usePresentationStore'
import { Button } from '../UI/Button'

const FABRIC_CDN = 'https://cdn.jsdelivr.net/npm/fabric@5.3.0/dist/fabric.min.js'

const ANIM_MAP: Record<string, string> = {
  'fade':        'hpmFadeIn {d}ms ease',
  'slide-left':  'hpmSlideLeft {d}ms ease',
  'slide-right': 'hpmSlideRight {d}ms ease',
  'zoom-in':     'hpmZoomIn {d}ms ease',
  'none':        '',
}

export function PreviewModal() {
  const { presentation, isPreviewOpen, togglePreview } = usePresentationStore()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const buildHtml = () => {
    const slidesData = JSON.stringify(presentation.slides.map((s) => ({
      canvas_json: s.canvasJson,
      background_color: s.backgroundColor,
      anim: (ANIM_MAP[s.animation.type] ?? '').replace('{d}', String(s.animation.duration * 1000)),
    })))
    const total = presentation.slides.length
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${presentation.title}</title>
<script src="${FABRIC_CDN}"></script>
<style>*{margin:0;padding:0}body{background:#0a0a10;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:Arial,sans-serif}
#wrap{border-radius:8px;overflow:hidden;box-shadow:0 20px 80px rgba(0,0,0,.8)}
.nav{margin-top:16px;display:flex;gap:10px;align-items:center}
.nav button{padding:8px 20px;background:#1c1c2e;color:#e8e8f2;border:1px solid #2a2a3a;border-radius:6px;cursor:pointer;font-size:13px}
.nav button:hover{background:#8b5cf6;border-color:#8b5cf6}
.ctr{color:#9090b0;font-size:12px;min-width:60px;text-align:center}
.pb{height:3px;background:#1c1c2e;width:960px;margin-top:10px;border-radius:2px}
.pbf{height:100%;background:#8b5cf6;transition:width .4s;border-radius:2px}
@keyframes hpmFadeIn{from{opacity:0}to{opacity:1}}
@keyframes hpmSlideLeft{from{transform:translateX(-100%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes hpmSlideRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes hpmZoomIn{from{transform:scale(.3);opacity:0}to{transform:scale(1);opacity:1}}
</style></head><body>
<div id="wrap"><canvas id="c"></canvas></div>
<div class="nav"><button onclick="go(-1)">◀ Prev</button><span class="ctr" id="ct">1/${total}</span><button onclick="go(1)">Next ▶</button></div>
<div class="pb"><div class="pbf" id="pb" style="width:${100/total}%"></div></div>
<script>var S=${slidesData},cur=0,tot=${total};
var c=new fabric.Canvas('c',{width:960,height:540,selection:false,interactive:false});
function show(n,d){var s=S[n];c.loadFromJSON(s.canvas_json,function(){c.backgroundColor=s.background_color;
if(s.anim){var el=c.wrapperEl;el.style.animation='none';el.offsetHeight;el.style.animation=s.anim;}
c.renderAll();});document.getElementById('ct').textContent=(n+1)+'/'+tot;
document.getElementById('pb').style.width=((n+1)/tot*100)+'%';}
function go(d){cur=(cur+d+tot)%tot;show(cur,d);}
document.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key===' ')go(1);if(e.key==='ArrowLeft')go(-1);});
show(0,1);</script></body></html>`
  }

  useEffect(() => {
    if (!isPreviewOpen || !iframeRef.current) return
    const html = buildHtml()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    iframeRef.current.src = url
    return () => URL.revokeObjectURL(url)
  }, [isPreviewOpen])

  const handleDownload = () => {
    const html = buildHtml()
    const blob = new Blob([html], { type: 'text/html' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${presentation.title}.html`
    a.click()
  }

  if (!isPreviewOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-panel border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-textPrimary">🎬 {presentation.title}</span>
          <span className="text-xs text-textMuted">{presentation.slides.length} slides · Use ← → to navigate</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<Download size={14} />} onClick={handleDownload}>
            Download HTML
          </Button>
          <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={togglePreview}>
            Close
          </Button>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        className="flex-1 w-full border-0"
        title="Presentation Preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  )
}

