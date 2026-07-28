type TimelineEntry = {
  timestamp: string;
  event: string;
};

class Timeline {
  private history: TimelineEntry[] = [];

  add(event: string) {
    const entry: TimelineEntry = {
      timestamp: new Date().toLocaleTimeString(),
      event,
    };

    this.history.push(entry);

    console.log("📜 Timeline");
    console.table(this.history);
  }

  getHistory() {
    return this.history;
  }

  clear() {
    this.history = [];
  }
}

export default new Timeline();