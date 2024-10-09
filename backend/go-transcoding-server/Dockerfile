FROM golang:latest

WORKDIR /transcoder

RUN apt-get update && apt-get install ffmpeg -y

CMD ["go", "run", "."]