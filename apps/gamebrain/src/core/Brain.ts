import EventBus from "./events/EventBus";
import Memory from "./memory/Memory";

class Brain {
  initialize() {
    console.log("🧠 BrainOS Initialized");

    EventBus.on("audio:start", () => {
      console.log("🧠 Brain recebeu: Audio iniciado");

      Memory.setAudioRunning(true);
      Memory.setLastEvent("audio:start");
      Memory.setLastMessage("Microfone iniciado");

      console.table(Memory.getState());
    });

    EventBus.on("audio:stop", () => {
      console.log("🧠 Brain recebeu: Audio parado");

      Memory.setAudioRunning(false);
      Memory.setLastEvent("audio:stop");
      Memory.setLastMessage("Microfone parado");

      console.table(Memory.getState());
    });
  }
}

export default new Brain();