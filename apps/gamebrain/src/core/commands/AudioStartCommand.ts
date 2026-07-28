import BaseCommand from "./BaseCommand";

class AudioStartCommand extends BaseCommand {
  override execute(): void {
    console.log("🚀 Executando AudioStartCommand");
  }
}

export default new AudioStartCommand();