package main

import (
	"fmt"
	"log"
	"os/exec"
	"sync"
)

/*

func PrintMessage(msg string) {
	for i := 0; i < 6; i++ {
		fmt.Println(msg, i)
		time.Sleep(time.Millisecond * 500)
	}
}

*/

func AsyncConcurrentSubProcess(command string, args ...string) {

	var wg sync.WaitGroup

	wg.Add(1)

	go func() {

		defer wg.Done()

		cmd := exec.Command(command, args...)

		// fmt.Println("Command Issued:", cmd.Args)

		// fmt.Printf("Started command: %s with PID %d\n", command, cmd.Process.Pid)

		// tmp := "ffmpeg -i content/gaming.mp4 -f dash -dash_segment_type mp4 -min_seg_duration 5000000 -init_seg_name init.mp4 -media_seg_name chunk$Number$.m4s -adaptation_sets id=0,streams=v id=1,streams=a content/out/output.mpd"

		output, err := cmd.CombinedOutput()

		if err != nil {
			log.Printf("Command finished with error: %v\nOutput: %s\n", err, output)
		} else {
			fmt.Printf("Command finished successfully:\n%s\n", string(output))
		}

	}()
	wg.Wait()
}
