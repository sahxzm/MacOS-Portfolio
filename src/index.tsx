import React, { useState } from "react";
import { createRoot } from "react-dom/client";

import Desktop from "~/pages/Desktop";
import Login from "~/pages/Login";
import Boot from "~/pages/Boot";

import "@unocss/reset/tailwind.css";
import "uno.css";
import "katex/dist/katex.min.css";
import "~/styles/index.css";
import { AudioProvider } from "./context/AudioContext";


export default function App() {
  const [login, setLogin] = useState<boolean>(false);
  const [booting, setBooting] = useState<boolean>(true);
  const [restart, setRestart] = useState<boolean>(false);
  const [sleep, setSleep] = useState<boolean>(false);

  const handleBootComplete = () => {
    setBooting(false);
    setLogin(false);
  };

  const shutMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setRestart(false);
    setSleep(false);
    setLogin(false);
    setBooting(true);
  };

  const restartMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setRestart(true);
    setSleep(false);
    setLogin(false);
    setBooting(true);
  };

  const sleepMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setRestart(false);
    setSleep(true);
    setLogin(false);
    setBooting(false);
  };

  if (booting) {
    return <Boot restart={restart} sleep={sleep} setBooting={handleBootComplete} />;
  } else if (!login) {
    return (
      <Login
        setLogin={setLogin}
        shutMac={shutMac}
        restartMac={restartMac}
        sleepMac={sleepMac}
      />
    );
  } else {
    return (
      <Desktop
        setLogin={setLogin}
        shutMac={shutMac}
        restartMac={restartMac}
        sleepMac={sleepMac}
      />
    );
  }
}

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AudioProvider>
      <App />
    </AudioProvider>
  </React.StrictMode>
);
