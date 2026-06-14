import json

from models.schemas import Presentation

_CSS_KEYFRAMES = """
@keyframes hpmFadeIn{from{opacity:0}to{opacity:1}}
@keyframes hpmSlideLeft{from{transform:translateX(-100%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes hpmSlideRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes hpmZoomIn{from{transform:scale(.3);opacity:0}to{transform:scale(1);opacity:1}}
"""

_ANIM_MAP = {
    "fade": "hpmFadeIn {d}ms ease",
    "slide-left": "hpmSlideLeft {d}ms ease",
    "slide-right": "hpmSlideRight {d}ms ease",
    "zoom-in": "hpmZoomIn {d}ms ease",
    "none": "",
}


class ExportService:
    W, H = 960, 540
    FABRIC_CDN = "https://cdn.jsdelivr.net/npm/fabric@5.3.0/dist/fabric.min.js"

    @classmethod
    def generate_html(cls, presentation: Presentation) -> str:
        slides_data = json.dumps(
            [
                {
                    "canvas_json": s.canvas_json,
                    "background_color": s.background_color,
                    "anim": _ANIM_MAP.get(s.animation.type, "").format(
                        d=int(s.animation.duration * 1000)
                    ),
                }
                for s in presentation.slides
            ]
        )
        return cls._template(presentation.title, slides_data, len(presentation.slides))

    @classmethod
    def _template(cls, title: str, slides_data: str, total: int) -> str:
        return f"""<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<script src="{cls.FABRIC_CDN}"></script>
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
body{{background:#0a0a10;display:flex;flex-direction:column;
  align-items:center;justify-content:center;min-height:100vh;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}}
#wrap{{border-radius:8px;overflow:hidden;box-shadow:0 25px 80px rgba(0,0,0,.8)}}
.nav{{margin-top:20px;display:flex;gap:12px;align-items:center}}
.nav button{{padding:10px 24px;background:#1c1c2e;color:#e8e8f2;border:1px solid #2a2a3a;
  border-radius:6px;cursor:pointer;font-size:14px;transition:all .2s}}
.nav button:hover{{background:#8b5cf6;border-color:#8b5cf6}}
.ctr{{color:#9090b0;font-size:13px;min-width:70px;text-align:center}}
.progress{{height:3px;background:#1c1c2e;border-radius:2px;
  margin-top:12px;width:{cls.W}px;overflow:hidden}}
.progress-bar{{height:100%;background:#8b5cf6;transition:width .4s ease;border-radius:2px}}
{_CSS_KEYFRAMES}
</style></head><body>
<div id="wrap"><canvas id="c"></canvas></div>
<div class="nav">
  <button onclick="go(-1)">&#9664; Prev</button>
  <span class="ctr" id="ctr">1 / {total}</span>
  <button onclick="go(1)">Next &#9654;</button>
</div>
<div class="progress"><div class="progress-bar" id="pb" style="width:{100//max(total,1)}%"></div></div>
<script>
var SLIDES={slides_data};
var cur=0,tot={total};
var canvas=new fabric.Canvas('c',{{width:{cls.W},height:{cls.H},selection:false,interactive:false}});
function showSlide(n,dir){{
  var s=SLIDES[n];
  canvas.loadFromJSON(s.canvas_json,function(){{
    canvas.backgroundColor=s.background_color;
    if(s.anim){{
      var el=canvas.wrapperEl;
      el.style.animation='none';
      el.offsetHeight;
      el.style.animation=s.anim;
    }}
    canvas.renderAll();
  }});
  document.getElementById('ctr').textContent=(n+1)+' / '+tot;
  document.getElementById('pb').style.width=((n+1)/tot*100)+'%';
}}
function go(d){{cur=(cur+d+tot)%tot;showSlide(cur,d);}}
document.addEventListener('keydown',function(e){{
  if(e.key==='ArrowRight'||e.key===' ')go(1);
  if(e.key==='ArrowLeft')go(-1);
  if(e.key==='Escape')document.exitFullscreen&&document.exitFullscreen();
}});
showSlide(0,1);
</script></body></html>"""
