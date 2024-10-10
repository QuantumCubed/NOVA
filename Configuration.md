# Configuration Steps

## Transcoding Server

1. Run `docker build -t <imagename:tag> .`
2. Run `docker run --name <container-name> -p 50051:50051 -v <SourceDir>:<DestinationDir> -w <DestinationDir> <imagename:tag>`

## NodeJS Webserver

1. Run `npm run dev` to start web-server

## NodeJS Webserver - Database

1. Run `docker run -d --name mongoDB -v nova_mongo_data:/data/db -p 27017:27017 mongo`