class AudioService {
  async start() {
    console.log("🎤 Solicitando acesso ao microfone...");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      console.log("✅ Microfone conectado");

      return stream;
    } catch (error) {
      console.error("❌ Erro ao acessar microfone", error);

      return null;
    }
  }

  stop(stream: MediaStream | null) {
    if (!stream) return;

    stream.getTracks().forEach((track) => track.stop());

    console.log("🔇 Microfone desligado");
  }
}

export default new AudioService();