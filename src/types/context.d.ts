import { Dispatch, SetStateAction } from 'react';

export interface MailExpandState {
  expand: boolean;
  x: number;
  y: number;
  hide: boolean;
  focusItem: boolean;
}

export interface ContextType {
  themeDragBar: string;
  MailExpand: MailExpandState;
  setMailExpand: Dispatch<SetStateAction<MailExpandState>>;
  lastTapTime: number;
  setLastTapTime: (time: number) => void;
  StyleHide: (appName: string) => void;
  isTouchDevice: boolean;
  clippyThanksYouFunction: () => void;
  handleSetFocusItemTrue: (appName: string) => void;
  inlineStyleExpand: (appName: string) => React.CSSProperties;
  inlineStyle: (appName: string) => React.CSSProperties;
  deleteTap: (appName: string) => void;
  iconFocusIcon: (appName: string) => void;
}

declare module '../Context' {
  const AppContext: React.Context<ContextType>;
  export default AppContext;
}
