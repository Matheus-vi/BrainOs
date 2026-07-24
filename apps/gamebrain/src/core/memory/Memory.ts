type MemoryEvent = {
  timestamp: Date;
  event: string;
  payload?: unknown;
};

class Memory {
  private history: MemoryEvent[] = [];

  add(event: string, payload?: unknown) {
    this.history.push({
      timestamp: new Date(),
      event,
      payload,
    });

    console.log("🧠 Memory:", this.history.at(-1));
  }

  getAll() {
    return this.history;
  }

  clear() {
    this.history = [];
  }
}

export default new Memory();