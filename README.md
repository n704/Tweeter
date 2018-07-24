# Tweeter
Twitter interface to limit messages to character limit.
this is sub divided into 2 parts `Tweeter_backend` and `Tweeter_frontend`.

## Docker Compose

### Create Docker Container.

`docker-compose build .`

During build both backend and frontend services, their test are runs.

### Run Docker

`docker-compose up`

This will launch application in port `8000` backend and `3000` frontend.
