# 🎨 HTML Presentation Maker by HADJ SASSI

**Professional presentation builder with Fabric.js canvas, Adobe/Figma-like UI/UX, real-time editing.**

## 🚀 Modern Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite + Fabric.js + Tailwind CSS |
| **Backend** | FastAPI + Pydantic + Uvicorn |
| **State Management** | Zustand (lightweight) |
| **Infrastructure** | Docker Compose + Caddy (reverse proxy) |

## ✨ MVP Features Delivered

✅ **Slide Management** — Add/delete/reorder/duplicate  
✅ **Fabric.js Canvas** — Drag-drop editing with multi-select  
✅ **Text Editor** — Font, size, color, alignment, bold/italic  
✅ **Media** — Images (upload/URL), videos, shapes  
✅ **Animations** — Fade, Slide, Zoom (5 types × configurable duration)  
✅ **Import/Export** — `.hpm` JSON + standalone HTML  
✅ **Professional UI** — Dark theme (Adobe/Figma inspired)  
✅ **Keyboard Shortcuts** — Del, Ctrl+A, Ctrl+D, Escape  

## 🏃 Quick Start (30 seconds)

### **Local Development**
```bash
make install    # Install npm + pip deps once
make dev        # Start Vite + Uvicorn hot-reload
```
Frontend: http://localhost:3000  
Backend: http://localhost:8000/docs

### **Docker (Production-Ready)**
```bash
make run        # Build & start all services
make logs      # Follow real-time logs
make down      # Clean up
```
Access at: **http://localhost**

## 🛠 Make Commands

```makefile
make install install-frontend install-backend  # Set up
make dev                                        # Dev with HMR
make run stop down ps                           # Docker
make cli logs                                   # Debug
make prettier                                   # Format code
```

## 📁 Architecture

```
core/                  FastAPI backend
├── main.py           ├─ Routers: /api/files, /api/export
├── models/           ├─ Schemas: Presentation, Slide, Animation
├── services/         ├─ Export HTML, File persistence
└── requirements.txt

frontend/              React + Fabric.js
├── src/components/   ├─ Header, Toolbar, SlidePanel, Canvas
├── src/store/        ├─ Zustand (global state)
├── src/hooks/        ├─ useFabricCanvas, useKeyboardShortcuts
└── package.json

docker-base/          Reverse proxy & orchestration
├── docker-compose.yml
└── Caddyfile
```

## 🎨 UI Preview

```
┌─────────────────────────────────────────┐  Header (title, load, save, preview)
├─────────────────────────────────────────┤  Toolbar (insert text, image, video, shapes)
│         │                       │       │
│ Slides  │     CANVAS EDITOR    │ Props │  Responsive layout
│ Panel   │    (Fabric.js)       │ Panel │  Dark theme, 960×540px canvas
│         │                       │       │
└─────────────────────────────────────────┘
  Left       Center (Full Height)    Right
  24%           ~50%                 ~26%
```

## 📝 File Format (.hpm)

```json
{
  "title": "My Presentation",
  "author": "HADJ SASSI",
  "slides": [
    {
      "title": "Slide 1",
      "background_color": "#FFFFFF",
      "canvas_json": "{...fabric.js objects...}",
      "animation": { "type": "fade", "duration": 0.6 },
      "thumbnail": "data:image/png;base64,..."
    }
  ],
  "version": "2.0"
}
```

Files are **human-readable JSON** — edit manually if needed!

## 🔌 Backend API

```
POST   /api/files/save         ← Save .hpm locally/cloud
POST   /api/files/load         ← Load .hpm
POST   /api/export/html        ← Download standalone HTML
GET    /api/files/health       ← Health check
```

Docs: http://localhost:8000/docs (Swagger UI)

## 🐳 Docker Deployment

```bash
# Build images
docker compose build

# Start (auto HTTPS with Let's Encrypt if domain configured)
docker compose up -d

# Monitor
docker compose logs -f

# Clean
docker compose down -v
```

**Ports:**
- `80` → Caddy (HTTP)
- `443` → Caddy (HTTPS)
- Frontend app on `/`
- Backend API on `/api/*`

## 🎯 Next Steps / Future

- [ ] More animations (exit, emphasis, motion paths)
- [ ] Click handlers & mouse interactions
- [ ] Layer panel (z-index management)
- [ ] PDF export
- [ ] Collaboration (real-time sync)
- [ ] Template library  
- [ ] Custom themes

## 🤝 Code Quality

```bash
make prettier    # Auto-format everything
```

Standards:  
- Frontend: Prettier (TypeScript, React, CSS)
- Backend: Black + isort (Python)

## 📄 License

MIT — Build beautiful presentations! 🎨

---

**by HADJ SASSI** — 2026 · Version 2.0
