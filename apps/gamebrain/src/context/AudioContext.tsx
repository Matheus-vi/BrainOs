import { createContext, useContext, useState, ReactNode } from "react";

import EventBus from "../core/events/EventBus";
import AudioService from "../services/AudioService";

type AudioContextType = {
  running: boolean;
  startAudio: () => Promise<void>;
  stopAudio: () => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

type AudioProviderProps = {
  children: ReactNode;
};

export function AudioProvider({ children }: AudioProviderProps) {
  const [running, setRunning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  async function startAudio() {
    const audioStream = await AudioService.start();

    if (!audioStream) return;

    setStream(audioStream);
    setRunning(true);

    EventBus.emit("audio:start");
  }

  function stopAudio() {
    AudioService.stop(stream);

    setRunning(false);
    setStream(null);

    EventBus.emit("audio:stop");
  }

  return (
    <AudioContext.Provider
      value={{
        running,
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
    throw new Error("useAudio precisa estar dentro do AudioProvider");
  }

  return context;
}