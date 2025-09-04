# Go の軽量イメージを利用
FROM golang:1.25-alpine

WORKDIR /app

# go.mod と go.sum をコピーして依存解決
COPY go.mod go.sum ./
RUN go mod download

# ソースコードをコピー
COPY . .

# サーバーをビルドして起動
RUN go build -o server main.go
CMD ["go", "run", "main.go"]
