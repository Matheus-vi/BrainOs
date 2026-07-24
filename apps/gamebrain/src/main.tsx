import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./styles/globals.css";
import "./styles/layout.css";
import "./styles/components.css";

import { AudioProvider } from "./context/AudioContext";

import Brain from "./core/Brain";

Brain.initialize();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AudioProvider>
      <App />
    </AudioProvider>
  </React.StrictMode>
);