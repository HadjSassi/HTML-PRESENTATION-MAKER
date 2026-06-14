.PHONY: install install-frontend install-backend start stop down ps logs dev

COMPOSE_DEV = cd docker-base && docker compose

# ── Local dev ──────────────────────────────────────────────────────
install: install-frontend install-backend

install-frontend:
	cd frontend && npm install
	cd viewer && npm install

install-backend:
	pip install -r core/requirements.txt

# Start frontend dev server (Vite HMR) + backend (uvicorn reload)
dev:
	@echo "Starting dev servers..." && \
	(cd frontend && npm run dev &) && \
	(cd viewer && npm run dev &) && \
	(cd core && uvicorn main:app --reload --port 8000)

# ── Docker ─────────────────────────────────────────────────────────
run:
	$(COMPOSE_DEV) up -d --build

stop:
	$(COMPOSE_DEV) stop

down:
	$(COMPOSE_DEV) down -v

ps:
	$(COMPOSE_DEV) ps

logs:
	$(COMPOSE_DEV) logs -f

# ── Code quality ───────────────────────────────────────────────────
prettier:
	cd frontend && npx prettier --write "src/**/*.{ts,tsx,css}" && \
	cd ../core && black . && isort .