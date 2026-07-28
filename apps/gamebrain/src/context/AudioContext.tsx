import AudioService from "../agents/AudioAgent/services/AudioService";
import EventBus from "../core/events/EventBus";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export type AudioStatus =
  | "idle"
  | "starting"
  | "running"
  | "stopped"
  | "error";

type AudioContextType = {
  status: AudioStatus;
  startAudio: () => Promise<void>;
  stopAudio: () => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export function AudioProvider({ children }: Props) {
  const [status, setStatus] = useState<AudioStatus>("idle");

  async function startAudio() {
    setStatus("starting");

    const success = await AudioService.start();

    if (!success) {
      setStatus("error");
      EventBus.emit("audio:error");
      return;
    }

    setStatus("running");
    EventBus.emit("audio:start");
  }

  function stopAudio() {
    AudioService.stop();

    setStatus("stopped");

    EventBus.emit("audio:stop");
  }

  return (
    <AudioContext.Provider
      value={{
        status,
        startAudio,
        stopAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error(
      "useAudio precisa estar dentro do AudioProvider"
    );
  }

  return context;
}