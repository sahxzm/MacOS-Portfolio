import React, { useState, useEffect } from "react";
import { apps } from "~/configs";
import { minMarginY } from "~/utils";
import type { MacActions } from "~/types";
import AppWindow from "~/components/AppWindow";
import TopBar from "~/components/menus/TopBar";
import Spotlight from "~/components/Spotlight";
import Dock from "~/components/dock/Dock";
import ResumeFolder from "~/components/apps/ResumeFolder";
import { useStore } from "~/stores";
import Widgets from "~/components/Widgets";

interface DesktopState {
  showApps: {
    [key: string]: boolean;
  };
  appsZ: {
    [key: string]: number;
  };
  maxApps: {
    [key: string]: boolean;
  };
  minApps: {
    [key: string]: boolean;
  };
  maxZ: number;
  currentTitle: string;
  hideDockAndTopbar: boolean;
  spotlight: boolean;
}

export default function Desktop(props: MacActions) {
  const [state, setState] = useState({
    showApps: {},
    appsZ: {},
    maxApps: {},
    minApps: {},
    maxZ: 2,
    currentTitle: "Finder",
    hideDockAndTopbar: false,
    spotlight: false
  } as DesktopState);

  const [spotlightBtnRef, setSpotlightBtnRef] =
    useState<React.RefObject<HTMLDivElement> | null>(null);

  const { dark, brightness, wallpaper } = useStore((state) => ({
    dark: state.dark,
    brightness: state.brightness,
    wallpaper: state.wallpaper,
  }));

  const getAppsData = (): void => {
    let showApps: { [key: string]: boolean } = {};
    let appsZ: { [key: string]: number } = {};
    let maxApps: { [key: string]: boolean } = {};
    let minApps: { [key: string]: boolean } = {};

    apps.forEach((app) => {
      showApps[app.id] = !!app.show;
      appsZ[app.id] = 2;
      maxApps[app.id] = false;
      minApps[app.id] = false;
    });

    setState((prev) => ({
      ...prev,
      showApps,
      appsZ,
      maxApps,
      minApps,
    }));
  };

  useEffect(() => {
    getAppsData();
  }, []);

  const toggleSpotlight = (): void => {
    setState({ ...state, spotlight: !state.spotlight });
  };

  const setWindowPosition = (id: string): void => {
    const r = document.querySelector(`#window-${id}`) as HTMLElement;
    const rect = r.getBoundingClientRect();
    r.style.setProperty(
      "--window-transform-x",
      // "+ window.innerWidth" because of the boundary for windows
      (window.innerWidth + rect.x).toFixed(1).toString() + "px"
    );
    r.style.setProperty(
      "--window-transform-y",
      // "- minMarginY" because of the boundary for windows
      (rect.y - minMarginY).toFixed(1).toString() + "px"
    );
  };

  const setAppMax = (id: string, target?: boolean): void => {
    const maxApps = state.maxApps;
    if (target === undefined) target = !maxApps[id];
    maxApps[id] = target;
    setState({
      ...state,
      maxApps: maxApps,
      hideDockAndTopbar: target,
    });
  };

  const setAppMin = (id: string, target?: boolean): void => {
    const minApps = state.minApps;
    if (target === undefined) target = !minApps[id];
    minApps[id] = target;
    setState({
      ...state,
      minApps: minApps,
    });
  };

  const minimizeApp = (id: string): void => {
    setWindowPosition(id);

    // get the corrosponding dock icon's position
    let r = document.querySelector(`#dock-${id}`) as HTMLElement;
    const dockAppRect = r.getBoundingClientRect();

    r = document.querySelector(`#window-${id}`) as HTMLElement;
    // const appRect = r.getBoundingClientRect();
    const posY = window.innerHeight - r.offsetHeight / 2 - minMarginY;
    // "+ window.innerWidth" because of the boundary for windows
    const posX = window.innerWidth + dockAppRect.x - r.offsetWidth / 2 + 25;

    // translate the window to that position
    r.style.transform = `translate(${posX}px, ${posY}px) scale(0.2)`;
    r.style.transition = "ease-out 0.3s";

    // add it to the minimized app list
    setAppMin(id, true);
  };

  const closeApp = (id: string): void => {
    setAppMax(id, false);
    const showApps = state.showApps;
    showApps[id] = false;
    setState({
      ...state,
      showApps: showApps,
      hideDockAndTopbar: false,
    });
  };

  const openApp = (id: string): void => {
    // add it to the shown app list
    const showApps = state.showApps;
    showApps[id] = true;

    // move to the top (use a maximum z-index)
    const appsZ = state.appsZ;
    const maxZ = state.maxZ + 1;
    appsZ[id] = maxZ;

    // get the title of the currently opened app
    const currentApp = apps.find((app) => {
      return app.id === id;
    });
    if (currentApp === undefined) {
      throw new TypeError(`App ${id} is undefined.`);
    }

    setState({
      ...state,
      showApps: showApps,
      appsZ: appsZ,
      maxZ: maxZ,
      currentTitle: currentApp.title,
    });

    const minApps = state.minApps;
    // if the app has already been shown but minimized
    if (minApps[id]) {
      // move to window's last position
      const r = document.querySelector(`#window-${id}`) as HTMLElement;
      r.style.transform = `translate(${r.style.getPropertyValue(
        "--window-transform-x"
      )}, ${r.style.getPropertyValue("--window-transform-y")}) scale(1)`;
      r.style.transition = "ease-in 0.3s";
      // remove it from the minimized app list
      minApps[id] = false;
      setState({ ...state, minApps });
    }
  };

  const isAnyAppMaximizedOrFullscreen = (): boolean => {
    return apps.some(
      (app) =>
        app.desktop &&
        state.showApps[app.id] &&
        (state.maxApps[app.id] || app.fullscreen)
    );
  };

  const renderAppWindows = () => {
    return apps.map((app) => {
      // Skip rendering if app is not shown or is fullscreen
      if (!app.desktop || !state.showApps[app.id] || app.fullscreen) {
        return null;
      }

      const props = {
        id: app.id,
        title: app.title,
        width: app.width,
        height: app.height,
        minWidth: app.minWidth,
        minHeight: app.minHeight,
        aspectRatio: app.aspectRatio,
        x: app.x,
        y: app.y,
        z: state.appsZ[app.id] || 2,
        max: state.maxApps[app.id],
        min: state.minApps[app.id],
        close: () => closeApp(app.id),
        setMax: setAppMax,
        setMin: minimizeApp,
        focus: openApp
      };

      // Special handling for AIChatbot to pass the closeApp function
      const appContent = app.id === 'siri'
        ? React.cloneElement(app.content as React.ReactElement, {
            onClose: () => closeApp('siri')
          })
        : app.content;

      return (
        <AppWindow key={`desktop-app-${app.id}`} {...props}>
          {appContent}
        </AppWindow>
      );
    });
  };

  const renderFullscreenApps = () => {
    return apps.map((app) => {
      if (!app.desktop || !state.showApps[app.id] || !app.fullscreen) {
        return null;
      }

      return (
        <div key={`fullscreen-app-${app.id}`} className="fixed inset-0 z-[9999] bg-black">
          {app.onOpen ? app.onOpen(() => closeApp(app.id)) : app.content}
        </div>
      );
    });
  };

  return (
    <div
      className={`w-full h-full overflow-hidden select-none ${dark ? "dark" : ""}`}
      style={{
        backgroundImage: 'var(--wallpaper-bg, none)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        filter: `brightness(${(brightness as number) * 0.7 + 50}%)`
      }}
    >
      {/* Fullscreen Apps */}
      {renderFullscreenApps()}

      {/* Rest of the UI */}
      {!Object.values(state.showApps).some((show, i) =>
        show && apps[i]?.fullscreen) && (
        <>
          {/* Top Menu Bar */}
          <TopBar
            title={state.currentTitle}
            setLogin={props.setLogin}
            shutMac={props.shutMac}
            sleepMac={props.sleepMac}
            restartMac={props.restartMac}
            toggleSpotlight={toggleSpotlight}
            hide={state.hideDockAndTopbar}
            setSpotlightBtnRef={setSpotlightBtnRef}
          />

          {/* Desktop Icons and Apps */}
          <div className="relative w-full h-full">
            {/* Desktop Icons - Only show when no app is maximized or fullscreen */}
            {!isAnyAppMaximizedOrFullscreen() && (
              <div className="desktop-icons-container">
                {/* Resume Folder on Desktop */}
                <div
                  style={{
                    position: 'fixed',
                    right: '32px',
                    top: '32px',
                    width: '80px',
                    height: '100px',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                  }}
                  onDoubleClick={() => openApp("resume")}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundImage: 'url(/logo/resume.png)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }} />
                  <div style={{
                    color: 'white',
                    marginTop: '8px',
                    fontSize: '12px',
                    textAlign: 'center'
                  }}>
                    Resume
                  </div>
                </div>

                {/* Sahil Profile on Desktop */}
                <div
                  style={{
                    position: 'fixed',
                    right: '32px',
                    top: '140px',
                    width: '80px',
                    height: '100px',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                  }}
                  onDoubleClick={() => openApp("sahil-profile")}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundImage: 'url(/logo/aboutme.png)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }} />
                  <div style={{
                    color: 'white',
                    marginTop: '8px',
                    fontSize: '12px',
                    textAlign: 'center'
                  }}>
                    About Me
                  </div>
                </div>

                {/* Sahil Projects on Desktop */}
                <div
                  style={{
                    position: 'fixed',
                    right: '32px',
                    top: '248px',
                    width: '80px',
                    height: '100px',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                  }}
                  onDoubleClick={() => openApp("sahil-projects")}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundImage: 'url(/logo/finder.png)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }} />
                  <div style={{
                    color: 'white',
                    marginTop: '8px',
                    fontSize: '12px',
                    textAlign: 'center'
                  }}>
                    Projects
                  </div>
                </div>
              </div>
            )}
            {/* Desktop Apps */}
            <div className="window-bound z-10 absolute" style={{ top: minMarginY }}>
              {renderAppWindows()}
            </div>

            {/* Widgets - Hide when any app is maximized or in fullscreen */}
            {!isAnyAppMaximizedOrFullscreen() && (
              <div className="fixed top-4 right-4 z-10 flex flex-col space-y-4">
                <Widgets />
              </div>
            )}
          </div>

          {/* Spotlight */}
          {state.spotlight && (
            <Spotlight
              openApp={openApp}
              toggleSpotlight={toggleSpotlight}
              btnRef={spotlightBtnRef as React.RefObject<HTMLDivElement>}
            />
          )}

          {/* Dock */}
          <Dock
            open={openApp}
            showApps={state.showApps}
            hide={state.hideDockAndTopbar}
          />
        </>
      )}
    </div>
  );
}
