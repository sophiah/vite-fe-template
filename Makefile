.PHONY: install dev build start clean docker-up docker-down docker-restart docker-logs

install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

clean:
	rm -rf dist

docker-up:
	docker compose build
	docker compose up -d

docker-down:
	docker compose down

docker-restart: docker-down docker-up

docker-logs:
	docker compose logs -f react-fe-template
