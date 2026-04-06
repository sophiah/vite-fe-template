.DEFAULT_GOAL := help

.PHONY: help install dev build start clean docker-up docker-down docker-restart docker-logs

help:
	@echo "Available targets:"
	@echo "  install         Install dependencies with yarn"
	@echo "  dev             Run Vite dev server"
	@echo "  build           Build frontend bundle"
	@echo "  start           Alias for dev"
	@echo "  clean           Remove dist"
	@echo "  docker-up       Build and start docker services"
	@echo "  docker-down     Stop docker services"
	@echo "  docker-restart  Restart docker services"
	@echo "  docker-logs     Tail frontend service logs"

install:
	yarn install

dev:
	yarn run dev

build:
	yarn run build

start:
	yarn run start

clean:
	rm -rf dist

docker-up:
	docker compose build
	docker compose up -d

docker-down:
	docker compose down

docker-restart: docker-down docker-up

docker-logs:
	docker compose logs -f frontend
