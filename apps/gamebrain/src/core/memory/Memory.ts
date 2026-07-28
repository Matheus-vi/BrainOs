type MemoryState = {
  audioRunning: boolean;
  lastEvent: string;
  lastMessage: string;
  version: string;
};

class Memory {
  private state: MemoryState = {
    audioRunning: false,
    lastEvent: "system:start",
    lastMessage: "BrainOS initialized",
    version: "0.1.0",
  };

  getState() {
    return this.state;
  }

  setAudioRunning(value: boolean) {
    this.state.audioRunning = value;
  }

  setLastEvent(event: string) {
    this.state.lastEvent = event;
  }

  setLastMessage(message: string) {
    this.state.lastMessage = message;
  }
}

export default new Memory();