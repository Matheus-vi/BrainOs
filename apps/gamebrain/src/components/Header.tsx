import { useAudio } from "../context/AudioContext";

export default function Header() {
  const { running, startAudio, stopAudio } = useAudio();

  return (
    <header className="panel">
      <h1>🧠 BrainOS</h1>

      <button
        onClick={() => {
          if (running) {
            stopAudio();
          } else {
            startAudio();
          }
        }}
      >
        {running ? "🔇 Stop Audio" : "🎤 Start Audio"}
      </button>
    </header>
  );
}