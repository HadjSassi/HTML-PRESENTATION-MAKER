import { useEffect, useRef } from "react";
import { usePresentationStore } from "../../store/usePresentationStore";

const FABRIC_CDN =
  "https://cdn.jsdelivr.net/npm/fabric@5.3.0/dist/fabric.min.js";

const ANIM_MAP: Record<string, string> = {
  fade: "hpmFadeIn {d}ms ease",
  "slide-left": "hpmSlideLeft {d}ms ease",
  "slide-right": "hpmSlideRight {d}ms ease",
  "zoom-in": "hpmZoomIn {d}ms ease",
  none: "",
};

export function PreviewModal() {
  const { presentation, isPreviewOpen, togglePreview } = usePresentationStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const buildHtml = () => {
    const slidesData = JSON.stringify(
      presentation.slides.map((s) => ({
        id: s.id,
        canvas_json: s.canvasJson,
        background_color: s.backgroundColor,
        anim: (ANIM_MAP[s.animation.type] ?? "").replace(
          "{d}",
          String(s.animation.duration * 1000),
        ),
      })),
    );
    const slideIdToIndex = presentation.slides.reduce(
      (acc, slide, index) => {
        acc[slide.id] = index;
        return acc;
      },
      {} as Record<string, number>,
    );

    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${presentation.title}</title>
<script src="${FABRIC_CDN}"></script>
<style>
  * { margin:0; padding:0; }
  body { background: #000; overflow: hidden; }
  .canvas-container { position: absolute !important; }
  @keyframes hpmFadeIn{from{opacity:0}to{opacity:1}}
  @keyframes hpmSlideLeft{from{transform:translateX(-100%);opacity:0}to{transform:translateX(0);opacity:1}}
  @keyframes hpmSlideRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
  @keyframes hpmZoomIn{from{transform:scale(.3);opacity:0}to{transform:scale(1);opacity:1}}
</style></head><body>
<canvas id="c"></canvas>
<script>
var S=${slidesData}, cur=0, hist=[];
var slideIdMap=${JSON.stringify(slideIdToIndex)};
var c=new fabric.Canvas('c',{width:960,height:540,selection:false,interactive:true});

function resizeCanvas() {
    const canvasEl = c.getElement().parentNode;
    const ratio = 960 / 540;
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;
    const windowRatio = newWidth / newHeight;
    if (windowRatio > ratio) { newWidth = newHeight * ratio; } else { newHeight = newWidth / ratio; }
    c.setDimensions({ width: newWidth, height: newHeight });
    c.setZoom(newWidth / 960);
    canvasEl.style.left = (window.innerWidth - newWidth) / 2 + 'px';
    canvasEl.style.top = (window.innerHeight - newHeight) / 2 + 'px';
}

function setObjectsInteractive(interactive) {
    c.getObjects().filter(o => !o.isLinkIndicator).forEach(function(o) {
        o.selectable = interactive;
        o.lockMovementX = !interactive; o.lockMovementY = !interactive;
        o.lockRotation = !interactive; o.lockScalingX = !interactive; o.lockScalingY = !interactive;
        o.hasControls = interactive; o.hasBorders = interactive;
        o.hoverCursor = interactive ? 'move' : 'default';
    });
    c.selection = interactive;
    if (!interactive) c.discardActiveObject();
    c.renderAll();
}

function getInvertedColor(hexColor) {
    const color = new fabric.Color(hexColor);
    const source = color.getSource();
    const r = 255 - source[0], g = 255 - source[1], b = 255 - source[2];
    return \`rgb(\${r},\${g},\${b})\`;
}

function showLinkIndicators(shouldShow) {
    c.getObjects().filter(o => o.isLinkIndicator).forEach(indicator => c.remove(indicator));
    if (shouldShow) {
        const bgColor = c.backgroundColor || '#FFFFFF';
        const invertedColor = getInvertedColor(bgColor);
        c.getObjects().filter(o => o.linkedSlideId).forEach(function(o) {
            o.setCoords();
            const bottomCenter = o.getPointByOrigin('center', 'bottom');
            const zoom = c.getZoom();
            var dot = new fabric.Circle({
                radius: 8 / zoom, fill: invertedColor, stroke: getInvertedColor(invertedColor), strokeWidth: 2 / zoom,
                left: bottomCenter.x, top: bottomCenter.y + (15 / zoom),
                originX: 'center', originY: 'center', selectable: false, hoverCursor: 'pointer',
                evented: true, isLinkIndicator: true, linkedSlideId: o.linkedSlideId, opacity: 0
            });
            c.add(dot);
            dot.animate('opacity', 1, { duration: 200, onChange: c.renderAll.bind(c), easing: fabric.util.ease.easeOutCubic });
        });
    }
    c.renderAll();
}

function show(n,d, anim){
  var s=S[n];
  c.loadFromJSON(s.canvas_json,function(){
    c.backgroundColor=s.background_color;
    var animation = anim || s.anim;
    if(animation && d !== 0){
      var el=c.wrapperEl; el.style.animation='none'; el.offsetHeight; el.style.animation=animation;
    }
    setObjectsInteractive(false);
    resizeCanvas();
  });
}

function go(d){
  var next = (cur+d+S.length)%S.length;
  if (d !== 0) hist.push(cur);
  cur=next;
  show(cur,d);
}

function goBack(){
  if(hist.length > 0) {
    cur = hist.pop();
    show(cur, 0, 'hpmFadeIn 1000ms ease');
  }
}

function jumpTo(slideId) {
  var slideIndex = slideIdMap[slideId];
  if (slideIndex !== undefined) {
    hist.push(cur);
    cur = slideIndex;
    show(cur, 1, 'hpmFadeIn 1000ms ease');
  }
}

c.on('mouse:down', (o) => o.e.shiftKey && o.target?.isLinkIndicator && jumpTo(o.target.linkedSlideId));
c.on('mouse:wheel', function(opt) {
    opt.e.preventDefault();
    opt.e.stopPropagation();
    if (opt.e.ctrlKey) {
        var delta = opt.e.deltaY;
        var zoom = c.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20; if (zoom < 0.1) zoom = 0.1;
        c.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    } else {
        var vpt = c.viewportTransform;
        if (vpt) {
            vpt[4] -= opt.e.deltaX;
            vpt[5] -= opt.e.deltaY;
            c.requestRenderAll();
        }
    }
    if (opt.e.shiftKey) {
        showLinkIndicators(true);
    }
});

window.addEventListener('resize', resizeCanvas);
document.addEventListener('keydown',function(e){
  if(e.repeat) return;
  if(e.key==='ArrowRight'||e.key===' ')go(1);
  if(e.key==='ArrowLeft')go(-1);
  if(e.key==='Backspace')goBack();
  if(e.key==='Alt') setObjectsInteractive(true);
  if(e.key==='Shift') showLinkIndicators(true);
  if(e.key==='Escape') window.parent.postMessage('close-preview', '*');
});
document.addEventListener('keyup', (e) => {
   if(e.key === 'Alt') setObjectsInteractive(false);
   if(e.key === 'Shift') showLinkIndicators(false);
});

show(0,1);
</script></body></html>`;
  };

  useEffect(() => {
    if (isPreviewOpen && containerRef.current) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
        );
      });
    }

    const handleMessage = (e: MessageEvent) => {
      if (e.data === "close-preview") togglePreview();
    };
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) togglePreview();
    };

    window.addEventListener("message", handleMessage);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isPreviewOpen, togglePreview]);

  if (!isPreviewOpen) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-black">
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        title="Presentation Preview"
        sandbox="allow-scripts allow-same-origin"
        srcDoc={buildHtml()}
      />
    </div>
  );
}
