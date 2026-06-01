# 🚀 QUICKSTART — HPM in 5 Minutes
## 1️⃣ Install Everything
```bash
cd PresentationMaker
make install
```
**What it does:**
- Installs Node.js dependencies (frontend)
- Installs Python dependencies (backend)
## 2️⃣ Start Development Servers
```bash
make dev
```
**Open in browser:**
- Frontend: http://localhost:3000
- Backend Docs: http://localhost:8000/docs
## 3️⃣ Create Your First Presentation
1. **Add a Slide** → Click `+` in left panel
2. **Add Text** → Click "Text" in toolbar, then click canvas to place
3. **Insert Image** → Click "Image" → Upload or paste URL
4. **Set Animation** → Right panel → Select "Fade" animation
5. **Preview** → Click "Preview" button (top right)
6. **Save** → Click "Save" → Download as `.hpm`
7. **Export HTML** → Click "Export" → Get shareable standalone file
## 📂 File Structure at a Glance
```
core/                FastAPI backend (Python)
├── main.py         ← App starts here
├── models/         ← Data schemas
├── services/       ← Business logic
└── routers/        ← API endpoints
frontend/           React app (TypeScript)
├── src/main.tsx    ← App starts here
├── src/App.tsx     ← Root component
└── src/components/ ← UI components
docker-base/        Production (Docker)
├── docker-compose.yml
└── Caddyfile
```
## 🎯 Key Features to Try
### Keyboard Shortcuts
- `Delete` — Remove selected object
- `Ctrl+A` — Select all
- `Ctrl+D` — Duplicate
- `Escape` — Deselect
- `←/→` (in preview) — Prev/Next slide
### Canvas Toolbar
- **Text** — Add stylable text
- **Image** — Upload/URL images
- **Video** — Embed videos
- **Rectangle** — Draw shapes
- **Line** — Draw lines
### Right Properties Panel
- **Slide settings** — Background, animations
- **Text editor** — Font, size, color, alignment
- **Image scaler** — Scale, fit mode
- **Shape editor** — Colors, sizes
## 💾 Save Your Work
```bash
# Download as .hpm (JSON)
Click "Save" button → file.hpm
# Download as standalone HTML
Click "Export" button → file.html
```
## 🐳 Production Deployment
```bash
# Build & start Docker containers
make run
# Access at http://localhost
make logs        # Monitor
make stop        # Stop services
make down        # Clean up
```
## 📚 Learn More
- **README.md** — Full feature list
- **DEVELOPMENT.md** — Developer guide
- **SUMMARY.md** — Architecture details
## 🆘 Troubleshooting
**Port already in use?**
```bash
lsof -i :3000    # Find process using port 3000
kill -9 <PID>    # Kill it
```
**Frontend won't build?**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```
**Backend won't start?**
```bash
cd core
pip install -r requirements.txt
python -m uvicorn main:app --reload
```
---
**Happy creating! 🎨**
