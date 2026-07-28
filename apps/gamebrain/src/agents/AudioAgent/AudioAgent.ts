import BaseAgent from "../BaseAgent";
import AudioService from "./services/AudioService";

class AudioAgent extends BaseAgent {
  constructor() {
    super("AudioAgent");
  }

  override initialize(): void {
    super.initialize();

    console.log("🎧 AudioAgent inicializado");
  }

  override async start(): Promise<void> {
    super.start();

    console.log("🎤 AudioAgent iniciado");

    await AudioService.start();
  }

  override stop(): void {
    super.stop();

    console.log("🔇 AudioAgent parado");

    AudioService.stop();
  }
}

export default new AudioAgent();