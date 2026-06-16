FROM golang:alpine

WORKDIR /app

COPY . .
COPY .env /app

RUN go mod tidy
RUN go build -o reservify-app main.go
RUN go build -o migrate ./cmd/migration
RUN go build -o seed ./cmd/seeder

CMD ["/app/reservify-app"]
