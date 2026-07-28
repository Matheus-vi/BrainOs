import { useAudio } from "../context/AudioContext";
import StatusCard from "./StatusCard";

export default function StatusPanel() {
  const { status } = useAudio();

  function getAudioColor() {
    switch (status) {
      case "running":
        return "green";

      case "starting":
        return "orange";

      case "error":
        return "red";

      case "stopped":
        return "gray";

      default:
        return "gray";
    }
  }

  return (
    <section>

      <StatusCard
        icon="🎤"
        title="Audio"
        status={status}
        color={getAudioColor()}
      />

      <StatusCard
        icon="🧠"
        title="Memory"
        status="Healthy"
        color="green"
      />

      <StatusCard
        icon="📜"
        title="Timeline"
        status="Recording"
        color="green"
      />

    </section>
  );
}