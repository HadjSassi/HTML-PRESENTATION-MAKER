.PHONY: install install-frontend install-backend run stop down ps cli prettier logs dev

COMPOSE = cd docker-base && docker compose

# ── Local dev ──────────────────────────────────────────────────────
install: install-frontend install-backend

install-frontend:
	cd frontend && npm install

install-backend:
	pip install -r core/requirements.txt

# Start frontend dev server (Vite HMR) + backend (uvicorn reload)
dev:
	@echo "Starting dev servers..." && \
	(cd frontend && npm run dev &) && \
	(cd core && uvicorn main:app --reload --port 8000)

# ── Docker ─────────────────────────────────────────────────────────
run:
	$(COMPOSE) up -d --build

stop:
	$(COMPOSE) stop

down:
	$(COMPOSE) down -v

ps:
	$(COMPOSE) ps

cli:
	$(COMPOSE) exec backend /bin/bash

logs:
	$(COMPOSE) logs -f

# ── Code quality ───────────────────────────────────────────────────
prettier:
	cd frontend && npx prettier --write "src/**/*.{ts,tsx,css}" && \
	cd ../core && black . && isort .
