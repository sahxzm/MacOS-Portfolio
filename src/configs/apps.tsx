import { appBarHeight } from "~/utils";
import type { AppsData } from "~/types";
import Typora from "~/components/apps/Typora";
import Safari from "~/components/apps/Safari";
import VSCode from "~/components/apps/VSCode";
import FaceTime from "~/components/apps/FaceTime";
import Terminal from "~/components/apps/Terminal";
import Spotify from "~/components/apps/Spotify";
import Mail from "~/components/apps/Mail";
import ResumeFolder from "~/components/apps/ResumeFolder";
import SpinningCat from "~/components/apps/SpinningCat";
import AIChatbot from "~/components/apps/AIChatbot";
import SahilProfile from "~/components/apps/SahilProfile";
import SahilProjects from "~/components/apps/SahilProjects";
import MonacoEditor from "~/components/apps/MonacoEditor";

const apps: AppsData[] = [
  {
    id: "resume",
    title: "Resume",
    desktop: true,
    show: false,
    dock: false,
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    x: 100,
    y: 100,
    img: "logo/folder.png",
    content: <ResumeFolder />,
  },
  {
    id: "mail",
    title: "Mail",
    desktop: true,
    width: 600,
    height: 500,
    minWidth: 400,
    minHeight: 400,
    x: 20,
    y: 20,
    img: "logo/gmail.png",
    content: <Mail />,
  },
  {
    id: "sahil-profile",
    title: "About Me",
    desktop: true,
    dock: false,
    show: false,
    width: 800,
    height: 700,
    minWidth: 600,
    minHeight: 400,
    x: 200,
    y: 100,
    img: "logo/aboutme.png",
    content: <SahilProfile />,
  },
  {
    id: "sahil-projects",
    title: "Sahil Projects",
    desktop: true,
    width: 1100,
    dock: false,
    height: 750,
    minWidth: 900,
    minHeight: 500,
    show: false,
    x: 150,
    y: 150,
    img: "logo/finder.png",
    content: <SahilProjects />,
  },
  {
    id: "typora",
    title: "Notes",
    desktop: true,
    width: 600,
    height: 580,
    y: -20,
    img: "logo/note.png",
    content: <Typora />,
  },
  {
    id: "safari",
    title: "Safari",
    desktop: true,
    width: 1024,
    minWidth: 375,
    minHeight: 200,
    x: -20,
    img: "img/icons/safari.png",
    content: <Safari />,
  },
  {
    id: "Xcode",
    title: "Xcode",
    desktop: true,
    dock: true,
    show: false,
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 500,
    x: 120,
    y: 80,
    img: "logo/xcode.png",
    content: <MonacoEditor/>,
  },
  {
    id: "vscode",
    title: "VSCode",
    desktop: true,
    width: 900,
    height: 600,
    x: 80,
    y: -30,
    img: "img/icons/vscode.png",
    content: <VSCode />,
  },
  {
    id: "facetime",
    title: "FaceTime",
    desktop: true,
    img: "img/icons/facetime.png",
    width: 500 * 1.7,
    height: 500 + appBarHeight,
    minWidth: 350 * 1.7,
    minHeight: 350 + appBarHeight,
    aspectRatio: 1.7,
    x: -80,
    y: 20,
    content: <FaceTime />,
  },
  {
    id: "terminal",
    title: "Terminal",
    desktop: true,
    width: 700,
    height: 500,
    minWidth: 500,
    minHeight: 300,
    img: "logo/terminal.png",
    content: <Terminal />,
  },
  {
    id: "github",
    title: "Github",
    desktop: false,
    img: "logo/github.png",
    link: "https://github.com/sahxzm",
  },
  {
    id: "spotify",
    title: "Spotify",
    desktop: true,
    width: 860,
    height: 500,
    show: false,
    y: -40,
    img: "logo/spotify.png",
    content: <Spotify />,
  },
  {
    id: "siri",
    title: "AI Chatbot",
    desktop: true,
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 500,
    show: false,
    x: 100,
    y: 50,
    img: "img/icons/siri.png",
    content: <AIChatbot onClose={() => {}} />,
    onOpen: (close: () => void) => {
      return <AIChatbot onClose={close} />;
    }
  },
  {
    id: 'spinning-cat',
    title: 'Spinning Cat',
    desktop: true,
    img: '/cat/catpic.png',
    width: 1800,
    height: 1200,
    minWidth: 1800,
    minHeight: 1200,
    noTitleBar: true,
    fullscreen: true,
    content: <SpinningCat onClose={() => {}} />,
    onOpen: (close: () => void) => {
      return <SpinningCat onClose={close} />;
    }
  },
];

export default apps;
