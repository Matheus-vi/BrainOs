import AgentManager from "./manager/AgentManager";
import EventBus from "./events/EventBus";
import Memory from "./memory/Memory";
import DecisionEngine from "./decision/DecisionEngine";
import Timeline from "./timeline/Timeline";

import CommandRegistry from "./commands/CommandRegistry";

import AudioAgent from "../agents/AudioAgent/AudioAgent";

import AudioStartCommand from "./commands/AudioStartCommand";
import AudioStopCommand from "./commands/AudioStopCommand";

class Brain {
  initialize() {
    console.log("🧠 BrainOS Initialized");

    AudioAgent.initialize();

    AgentManager.register(
      AudioAgent.getInfo().name,
      AudioAgent
    );

    console.table(AudioAgent.getInfo());

    AgentManager.listAgents();

    CommandRegistry.register(
      "audio:start",
      AudioStartCommand
    );

    CommandRegistry.register(
      "audio:stop",
      AudioStopCommand
    );

    CommandRegistry.list();

    Timeline.add("BrainOS iniciado");

    this.registerEvents();
  }

  private registerEvents() {
    EventBus.on("audio:start", async () => {
      Memory.setAudioRunning(true);
      Memory.setLastEvent("audio:start");
      Memory.setLastMessage("Microfone iniciado");

      Timeline.add("🎤 Microfone iniciado");

      await DecisionEngine.dispatch("audio:start");

      console.log("🧠 Brain: áudio iniciado");
    });

    EventBus.on("audio:stop", async () => {
      Memory.setAudioRunning(false);
      Memory.setLastEvent("audio:stop");
      Memory.setLastMessage("Microfone parado");

      Timeline.add("🔇 Microfone parado");

      await DecisionEngine.dispatch("audio:stop");

      console.log("🧠 Brain: áudio parado");
    });
  }
}

export default new Brain();