import BaseCommand from "./BaseCommand";

class AudioStopCommand extends BaseCommand {
  override execute(): void {
    console.log("🛑 Executando AudioStopCommand");
  }
}

export default new AudioStopCommand();
