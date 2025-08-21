APP_NAME=monitor-2
PORT=3333

build:
	docker build -t $(APP_NAME) .

run:
	docker run --name $(APP_NAME) -d -p $(PORT):$(PORT) $(APP_NAME)

stop:
	docker stop $(APP_NAME) || true
	docker rm $(APP_NAME) || true

restart: stop run

logs:
	docker logs -f $(APP_NAME)

ps:
	docker ps -a | grep $(APP_NAME)
