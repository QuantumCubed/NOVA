package main

func main() {

	cmd := "ffmpeg"

	args := []string{
		"-re",
		"-i", "content/gaming.mp4",
		//"-map 0", "-map 0",
		"-c:a", "aac", // libfdk_aac
		"-c:v", "libx264",
		//"-b:v:0", "800k",
		//"-b:"
		//"-window_size", "5",
		//"-media_seg_name", "chunk$Number$.m4s",
		"-f", "dash",
		"-adaptation_sets", "id=0,streams=v id=1,streams=a",
		"content/out/output.mpd",
	}

	//fmt.Printf("Arguments: %v\n", args)

	/*
		args := []string{

			"-i", "content/gaming.mp4",
			"-map", "0",
			"-map", "0",
			"-c:v", "libx264",
			"-c:a", "libfdk_aac",
			"-b:v:0", "800k",
			"-b:v:1", "300k",
			"-s:v:1", "320x170",
			"-profile:v:1", "baseline",
			"-profile:v:0", "main",
			"-bf", "1",
			"-keyint_min", "120",
			"-g", "120",
			"-sc_threshold", "0",
			"-b_strategy", "0",
			"-ar:a:1", "22050",
			"-use_timeline", "1",
			"-use_template", "1",
			"-window_size", "5",
			"-adaptation_sets", "id=0,streams=v id=1,streams=a",
			"-f", "dash",
			"content/out/output.mpd",
		}

	*/

	/*
		args := []string{

			"-i", "content/gaming.mp4",
			"-c:v", "copy",
			"-c:a", "copy",
			"-f", "dash",
			"-adaptation_sets", "id=0,streams=v id=1,streams=a",
			"content/out/output.mpd",
		}

	*/

	AsyncConcurrentSubProcess(cmd, args...)

}

/*

import (
	"context"
	"fmt"
	"log"
	"net"

	transcode "nova/transcoder/proto"

	"google.golang.org/grpc"
)

type server struct {
	transcode.UnimplementedMyServiceServer
}

func (s *server) MyMethod(ctx context.Context, req *transcode.MyRequest) (*transcode.MyResponse, error) {

	message := "Hello, " + req.Name

	fmt.Println("Response Sent!")

	return &transcode.MyResponse{Message: message}, nil

}




func main() {

	lis, err := net.Listen("tcp", ":50051")

	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()

	transcode.RegisterMyServiceServer(grpcServer, &server{})

	log.Println("gRPC server is running on port 50051")

	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}

}

*/
