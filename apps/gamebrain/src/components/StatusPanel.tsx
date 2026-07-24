import { useAudio } from "../context/AudioContext";

export default function StatusPanel() {
  const { running } = useAudio();

  return (
    <section className="panel">
      <h2>Status</h2>

      <p>
        Audio: {running ? "🟢 Online" : "🔴 Offline"}
      </p>

      <p>Version: 0.1.0</p>
    </section>
  );
}