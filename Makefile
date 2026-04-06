.DEFAULT_GOAL := help

.PHONY: help docker-up docker-down docker-restart docker-logs

FE_DIR := frontend
COMPOSE_FILE := docker-compose.yml
COMPOSE := docker compose -f $(COMPOSE_FILE)

help:
	@echo "Available targets:"
	@echo "  docker-up       Build and start docker services"
	@echo "  docker-down     Stop docker services"
	@echo "  docker-restart  Restart docker services"
	@echo "  docker-logs     Tail frontend service logs"

docker-up:
	$(COMPOSE) build
	$(COMPOSE) up -d

docker-down:
	$(COMPOSE) down

docker-restart: docker-down docker-up

docker-logs:
	$(COMPOSE) logs -f frontend
