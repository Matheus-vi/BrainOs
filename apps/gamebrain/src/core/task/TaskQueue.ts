type Task = () => void | Promise<void>;

class TaskQueue {
  private queue: Task[] = [];

  add(task: Task) {
    this.queue.push(task);

    console.log(`📥 Task adicionada. Total: ${this.queue.length}`);
  }

  async run() {
    console.log("⚙️ Executando TaskQueue");

    while (this.queue.length > 0) {
      const task = this.queue.shift();

      if (!task) continue;

      await task();
    }

    console.log("✅ TaskQueue finalizada");
  }

  size() {
    return this.queue.length;
  }
}

export default new TaskQueue();