import React, { useRef, useState } from "react";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import { music } from "~/configs";
import wallpapers from "~/configs/wallpapers";
import { useStore } from "~/stores";

interface SliderProps {
  icon: string;
  value: number;
  setValue: (value: number) => void;
}

const SliderComponent = ({ icon, value, setValue }: SliderProps) => (
  <div className="slider flex">
    <div className="size-7 flex-center bg-c-100" border="t l b c-300 rounded-l-full">
      <span className={icon} text="xs c-500" />
    </div>
    <Slider
      min={1}
      max={100}
      value={value}
      tooltip={false}
      orientation="horizontal"
      onChange={(v: number) => setValue(v)}
    />
  </div>
);

interface CCMProps {
  toggleControlCenter: () => void;
  toggleAudio: (target: boolean) => void;
  setBrightness: (value: number) => void;
  setVolume: (value: number) => void;
  playing: boolean;
  btnRef: React.RefObject<HTMLDivElement>;
}

export default function ControlCenterMenu({
  toggleControlCenter,
  toggleAudio,
  setBrightness,
  setVolume,
  playing,
  btnRef
}: CCMProps) {
  const controlCenterRef = useRef<HTMLDivElement>(null);
  const [showWallpapers, setShowWallpapers] = useState(false);

  const { dark, wifi, brightness, bluetooth, airdrop, fullscreen, volume, wallpaper, setWallpaper, toggleDark, toggleWIFI, toggleBluetooth, toggleAirdrop, toggleFullScreen } = useStore(
    (state) => ({
      dark: state.dark,
      wifi: state.wifi,
      brightness: state.brightness,
      bluetooth: state.bluetooth,
      airdrop: state.airdrop,
      fullscreen: state.fullscreen,
      volume: state.volume,
      wallpaper: state.wallpaper,
      setWallpaper: state.setWallpaper,
      toggleDark: state.toggleDark,
      toggleWIFI: state.toggleWIFI,
      toggleBluetooth: state.toggleBluetooth,
      toggleAirdrop: state.toggleAirdrop,
      toggleFullScreen: state.toggleFullScreen,
    })
  );

  const handleWallpaperSelect = (wp: string) => {
    setWallpaper(wp);
    setShowWallpapers(false);
  };

  useClickOutside(controlCenterRef, toggleControlCenter, [btnRef]);

  return (
    <div
      className="control-center w-80 max-h-[90vh] overflow-y-auto p-3 text-c-black dark:text-c-white rounded-2xl"
      style={{
        '--tw-bg-opacity': '0.9',
        '--tw-backdrop-blur': 'blur(24px)',
        position: 'fixed',
        top: '2.75rem',
        right: '0.5rem',
        zIndex: 1000,
      } as React.CSSProperties}
      ref={controlCenterRef}
    >
      {/* Main Grid Layout */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Network and Bluetooth Section */}
        <div className="cc-grid p-2.5 space-y-3">
          <div className="hstack space-x-2">
            <div className={`${wifi ? "cc-btn" : "cc-btn-active"}`} onClick={toggleWIFI}>
              <span className="i-bi:wifi text-base" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Wi-Fi</div>
              <div className="text-xs text-c-500 dark:text-c-400">{wifi ? "Connected" : "Off"}</div>
            </div>
          </div>

          <div className="hstack space-x-2">
            <div className={`${bluetooth ? "cc-btn" : "cc-btn-active"}`} onClick={toggleBluetooth}>
              <span className="i-charm:bluetooth text-base" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Bluetooth</div>
              <div className="text-xs text-c-500 dark:text-c-400">{bluetooth ? "On" : "Off"}</div>
            </div>
          </div>

          <div className="hstack space-x-2">
            <div className={`${airdrop ? "cc-btn" : "cc-btn-active"}`} onClick={toggleAirdrop}>
              <span className="i-material-symbols:rss-feed-rounded text-base" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">AirDrop</div>
              <div className="text-xs text-c-500 dark:text-c-400">{airdrop ? "Contacts Only" : "Off"}</div>
            </div>
          </div>
        </div>

        {/* Display and Sound Controls */}
        <div className="space-y-2.5">
          <div className="cc-grid p-2.5">
            <div className="text-sm font-medium mb-1.5">Display</div>
            <SliderComponent
              icon="i-ion:sunny"
              value={brightness}
              setValue={setBrightness}
            />
          </div>

          <div className="cc-grid p-2.5">
            <div className="text-sm font-medium mb-1.5">Sound</div>
            <SliderComponent
              icon="i-ion:volume-high"
              value={volume}
              setValue={setVolume}
            />
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="cc-grid p-2.5">
          <div className="hstack justify-between items-center">
            <div className="text-sm font-medium">Dark Mode</div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={dark}
                onChange={toggleDark}
              />
              <div className="w-11 h-6 bg-c-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-c-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-c-600 peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>

        {/* Wallpaper Button */}
        <div
          className="cc-grid p-2.5 flex flex-col items-center justify-center cursor-pointer hover:bg-c-200/50 dark:hover:bg-c-600/50 rounded-xl transition-colors"
          onClick={() => setShowWallpapers(!showWallpapers)}
        >
          <span className="i-bi:image text-xl mb-1" />
          <span className="text-xs">Wallpaper</span>
        </div>

        {/* Fullscreen Toggle */}
        <div
          className="cc-grid p-2.5 flex flex-col items-center justify-center cursor-pointer hover:bg-c-200/50 dark:hover:bg-c-600/50 rounded-xl transition-colors"
          onClick={() => toggleFullScreen(!fullscreen)}
        >
          {fullscreen ? (
            <span className="i-bi:fullscreen-exit text-xl mb-1" />
          ) : (
            <span className="i-bi:fullscreen text-xl mb-1" />
          )}
          <span className="text-xs">{fullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
        </div>
      </div>

      {/* Now Playing */}
      <div className="cc-grid mt-2.5 p-2.5">
        <div className="text-sm font-medium mb-2">Now Playing</div>
        <div className="hstack space-x-3">
          <img
            src={music.cover}
            alt="Album Cover"
            className="w-12 h-12 rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{music.title}</div>
            <div className="text-xs text-c-500 dark:text-c-400 truncate">{music.artist}</div>
          </div>
          <button className="p-2 rounded-full hover:bg-c-200/50 dark:hover:bg-c-600/50">
            {playing ? (
              <span className="i-bi:pause-fill text-xl" onClick={() => toggleAudio(false)} />
            ) : (
              <span className="i-bi:play-fill text-xl" onClick={() => toggleAudio(true)} />
            )}
          </button>
        </div>
      </div>

      {/* Wallpaper Selection */}
      {showWallpapers && (
        <div className="mt-3 p-3 bg-c-200/50 dark:bg-c-700/80 backdrop-blur-xl rounded-xl border border-c-300/50 dark:border-c-600/50">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium">Choose Wallpaper</h4>
            <button
              onClick={() => setShowWallpapers(false)}
              className="p-1 rounded-full hover:bg-c-300/50 dark:hover:bg-c-600/50"
            >
              <span className="i-bi:x-lg text-sm" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
            {Object.entries(wallpapers).map(([name, path]) => (
              <div
                key={name}
                className={`relative rounded-lg overflow-hidden aspect-video cursor-pointer transition-transform hover:scale-105 ${
                  wallpaper === name ? 'ring-2 ring-blue-500' : 'ring-1 ring-c-300 dark:ring-c-600'
                }`}
                onClick={() => handleWallpaperSelect(name)}
              >
                <img
                  src={`/${path}`}
                  alt={name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                  <div className="text-xs text-white font-medium truncate">{name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
