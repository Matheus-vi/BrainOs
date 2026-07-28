class AudioService {
  private stream: MediaStream | null = null;

  async start(): Promise<boolean> {
    try {
      console.log("🎤 Solicitando acesso ao microfone...");

      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      console.log("✅ Microfone iniciado");

      return true;
    } catch (error) {
      console.error("❌ Microfone indisponível", error);

      this.stream = null;

      return false;
    }
  }

  stop() {
    if (!this.stream) {
      return;
    }

    this.stream.getTracks().forEach((track) => track.stop());

    this.stream = null;

    console.log("🔇 Microfone parado");
  }

  isRunning() {
    return this.stream !== null;
  }
}

export default new AudioService();