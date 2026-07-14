// app/lib/videoLoadQueue.ts
"use client";

type Task = () => void;

class VideoLoadQueue {
  private queue: Task[] = [];
  private active = 0;
  private maxConcurrent = 2;

  setMaxConcurrent(n: number) {
    this.maxConcurrent = n;
  }

  enqueue(task: Task) {
    this.queue.push(task);
    this.process();
  }

  done() {
    this.active = Math.max(0, this.active - 1);
    this.process();
  }

  private process() {
    while (this.active < this.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift()!;
      this.active++;
      task();
    }
  }
}

export const videoLoadQueue = new VideoLoadQueue();