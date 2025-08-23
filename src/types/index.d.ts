import React from "react";

export interface MacActions {
  setLogin: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  shutMac: (e: React.MouseEvent) => void;
  restartMac: (e: React.MouseEvent) => void;
  sleepMac: (e: React.MouseEvent) => void;
}

export interface AppsData {
  id: string;
  title: string;
  desktop: boolean;
  dock?: boolean;
  show?: boolean;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  x?: number;
  y?: number;
  img?: string;
  content?: React.ReactNode;
  link?: string;
  aspectRatio?: number;
}

export {
  SahilMdData,
  SahilData,
  MusicData,
  TerminalData,
  UserData,
  WallpaperData,
  WebsitesData,
  SiteSectionData,
  SiteData
} from "./configs";
