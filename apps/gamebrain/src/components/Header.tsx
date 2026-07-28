import { useAudio } from "../context/AudioContext";

export default function Header() {
  const { status, startAudio, stopAudio } = useAudio();

  const running = status === "running";

  return (
    <header className="panel">
      <h1>🧠 BrainOS</h1>

      <button onClick={running ? stopAudio : startAudio}>
        {running ? "🔇 Stop Audio" : "🎤 Start Audio"}
      </button>

      <p>Status do áudio: {status}</p>
    </header>
  );
}