# 🛠 Development Guide

## Project Overview

**HTML Presentation Maker** is a full-stack modern web application with:
- React 18 frontend (Vite + TypeScript)
- FastAPI backend (Python)
- Fabric.js canvas for real-time editing
- Docker for containerization

## Local Development Setup

### Prerequisites
- Node.js 20+ (npm 10+)
- Python 3.11+
- Git

### Installation

```bash
# Clone or navigate to project
cd PresentationMaker

# Install all dependencies
make install

# This runs:
# - npm install (frontend)
# - pip install -r core/requirements.txt (backend)
```

### Start Development Servers

```bash
make dev
```

This starts two dev servers with hot-reload:
- **Frontend (Vite)**: http://localhost:3000
- **Backend (Uvicorn)**: http://localhost:8000

### Accessing the Application

**Frontend**: http://localhost:3000
- Vite dev server with hot module replacement (HMR)
- Frontend automatically proxies `/api/*` to backend (see vite.config.ts)

**Backend API Docs**: http://localhost:8000/docs
- Interactive Swagger UI
- Test API endpoints directly

---

## Project Structure Explained

### Frontend (`frontend/`)

```
src/
├── main.tsx             # React entry point
├── App.tsx              # Root component
├── index.css            # Tailwind + custom styles
├── types/               # TypeScript interfaces & types
├── store/               # Zustand global state
│   └── usePresentationStore.ts
├── contexts/            # React Context
│   └── CanvasContext.tsx
├── hooks/               # Custom React hooks
│   ├── useFabricCanvas.ts    # Fabric.js initialization & lifecycle
│   └── useKeyboardShortcuts.ts
├── utils/               # Helper functions
│   ├── constants.ts
│   └── fileUtils.ts
└── components/          # UI components (organized by feature)
    ├── Header/          # Title, buttons, actions
    ├── Toolbar/         # Insert tools (text, image, video, shapes)
    ├── SlidePanel/      # Left sidebar with slides
    ├── Canvas/          # Center canvas editor
    ├── Properties/      # Right panel with property inspector
    ├── Preview/         # Full-screen preview modal
    └── UI/              # Reusable UI (Button, Input, ColorPicker, Select)
```

**Key Concepts:**

1. **Store (Zustand)**: Global state for presentation, slides, selections
2. **Context**: Canvas reference shared across components
3. **Hooks**: Fabric.js lifecycle management
4. **Components**: Functional, composable, one responsibility each

### Backend (`core/`)

```
├── main.py              # FastAPI app setup
├── models/
│   └── schemas.py       # Pydantic models (Presentation, Slide, Animation)
├── services/
│   ├── file_service.py  # .hpm file I/O
│   └── export_service.py # HTML generation
└── routers/
    ├── files.py         # /api/files/* endpoints
    └── export.py        # /api/export/* endpoints
```

**Key Concepts:**

1. **Pydantic**: Type-safe data validation
2. **FastAPI**: Async web framework with auto docs
3. **Services**: Business logic (separate from routes)
4. **Routers**: Modular endpoint organization

### Infrastructure (`docker-base/`)

```
docker-compose.yml      # 3 services: frontend, backend, caddy
Caddyfile              # Reverse proxy configuration
```

---

## Key Development Tasks

### Adding a New Element Type

1. **Frontend**: Create componentin `components/Toolbar/Toolbar.tsx`
   ```typescript
   function addMyElement(canvas: fabric.Canvas) {
     const obj = new fabric.MyShape({ ... })
     canvas.add(obj)
   }
   ```

2. **Properties Editor**: Add handler in `components/Properties/PropertiesPanel.tsx`
   ```typescript
   } else if (customType === 'myElement') {
     content = <MyElementProperties obj={active} canvas={canvas!} />
   }
   ```

3. **Export**: Ensure serialization works in `services/export_service.py`

### Modifying the Data Model

1. Edit `models/schemas.py` (Pydantic models)
2. Update frontend types in `frontend/src/types/index.ts`
3. Backend automatically validates; frontend store auto-updates

### Working with Canvas Events

Example: Detect when an object is modified
```typescript
canvas.on('object:modified', () => {
  const json = JSON.stringify(canvas.toJSON())
  // Save to store
  updateCanvas(idx, json)
})
```

See `hooks/useFabricCanvas.ts` for more events.

---

## Testing

### Frontend Tests
```bash
cd frontend
npm test -- --watch
```

### Backend Tests
```bash
cd core
pytest -v --reload
```

### Full Integration
```bash
# Start dev servers
make dev

# In another terminal, test endpoints
curl http://localhost:8000/docs
curl http://localhost:3000
```

---

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
# Outputs: dist/
```

### Docker Build
```bash
# Build images
docker compose build

# Start services
docker compose up -d

# Access at http://localhost
```

### Debugging Docker
```bash
make logs              # Follow logs
make cli               # Shell into backend
docker compose ps      # List services
```

---

## Code Style & Quality

### Auto-Format Code
```bash
make prettier

# Formats:
# - Frontend: Prettier for .ts/.tsx/.css
# - Backend: Black + isort for .py
```

### TypeScript Strict Mode
All components use `strict: true` in `tsconfig.json`.

### Python Best Practices
- PEP 8 style (enforced by Black)
- Type hints everywhere
- Pydantic validation

---

## Environment Variables

Create `.env.local` in project root (ignored by git):

```env
VITE_API_BASE=http://localhost:8000/api
```

Or use defaults in `vite.config.ts`.

---

## Troubleshooting

### Port Already in Use
```bash
# Frontend (3000)
lsof -i :3000
kill -9 <PID>

# Backend (8000)
lsof -i :8000
kill -9 <PID>
```

### Fabric.js TypeScript Errors
- Ensure `@types/fabric` is installed: `npm ls @types/fabric`
- Use `type { fabric }` for imports

### CORS Issues
- Vite proxy handles `/api/*` → backend in dev
- Caddy handles it in Docker
- FastAPI has CORS middleware enabled

### Node Modules Issues
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Python Dependency Issues
```bash
cd core
pip install --upgrade -r requirements.txt
```

---

## Resources

- **Fabric.js Docs**: https://fabricjs.com/
- **React Docs**: https://react.dev/
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Zustand**: https://github.com/pmndrs/zustand

---

## Common Commands Reference

```bash
# Development
make install              # One-time setup
make dev                  # Start dev servers with HMR
make prettier             # Auto-format code

# Docker
make run                  # Build & start containers
make stop                 # Stop containers
make down                 # Stop & remove everything
make logs                 # Follow Docker logs
make ps                   # List containers
make cli                  # Shell into backend

# Debugging
npm run build             # Frontend production build
python -m pytest          # Backend tests
curl localhost:8000/docs  # Backend API docs
```

---

**Happy coding!** 🚀

