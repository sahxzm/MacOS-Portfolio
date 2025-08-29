import type { StateCreator } from "zustand";
import { enterFullScreen, exitFullScreen } from "~/utils";
import wallpapers from "~/configs/wallpapers";

export interface SystemSlice {
  dark: boolean;
  volume: number;
  brightness: number;
  wifi: boolean;
  bluetooth: boolean;
  airdrop: boolean;
  fullscreen: boolean;
  wallpaper: string;
  toggleDark: () => void;
  toggleWIFI: () => void;
  toggleBluetooth: () => void;
  toggleAirdrop: () => void;
  toggleFullScreen: (v: boolean) => void;
  setVolume: (v: number) => void;
  setBrightness: (v: number) => void;
  setWallpaper: (wp: string) => void;
}

// Helper function to apply wallpaper styles
export const applyWallpaper = (wp: string) => {
  const wallpaperPath = wallpapers[wp as keyof typeof wallpapers];
  if (!wallpaperPath) return;

  const wallpaperUrl = `url(/${wallpaperPath})`;

  // Set CSS variable for both light and dark mode
  document.documentElement.style.setProperty('--wallpaper-bg', wallpaperUrl);

  // Apply to body for login screen
  document.body.style.backgroundImage = wallpaperUrl;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundAttachment = 'fixed';

  // Apply to root element for desktop
  const root = document.getElementById('root');
  if (root) {
    root.style.backgroundImage = wallpaperUrl;
    root.style.backgroundSize = 'cover';
    root.style.backgroundPosition = 'center';
    root.style.backgroundRepeat = 'no-repeat';
    root.style.backgroundAttachment = 'fixed';
  }
};

// Initialize with default wallpaper if none is set
const getInitialWallpaper = () => {
  if (typeof window === 'undefined') return 'day';

  const savedWallpaper = localStorage.getItem('wallpaper');
  if (savedWallpaper && wallpapers[savedWallpaper as keyof typeof wallpapers]) {
    applyWallpaper(savedWallpaper);
    return savedWallpaper;
  }

  // Default to day theme
  applyWallpaper('day');
  return 'day';
};

export const createSystemSlice: StateCreator<SystemSlice> = (set) => ({
  dark: false,
  volume: 100,
  brightness: 80,
  wifi: true,
  bluetooth: true,
  airdrop: true,
  fullscreen: false,
  wallpaper: getInitialWallpaper(),

  toggleDark: () =>
    set((state) => {
      if (!state.dark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return { dark: !state.dark };
    }),

  toggleWIFI: () => set((state) => ({ wifi: !state.wifi })),
  toggleBluetooth: () => set((state) => ({ bluetooth: !state.bluetooth })),
  toggleAirdrop: () => set((state) => ({ airdrop: !state.airdrop })),

  toggleFullScreen: (v) =>
    set(() => {
      v ? enterFullScreen() : exitFullScreen();
      return { fullscreen: v };
    }),

  setVolume: (v) => set(() => ({ volume: v })),
  setBrightness: (v) => set(() => ({ brightness: v })),

  setWallpaper: (wp) => {
    if (typeof window !== 'undefined' && wallpapers[wp as keyof typeof wallpapers]) {
      localStorage.setItem('wallpaper', wp);
      applyWallpaper(wp);
      return { wallpaper: wp };
    }
    return {}; // No state update if invalid wallpaper
  }
});
