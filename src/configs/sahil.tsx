import type { SahilData } from "~/types";

const sahil: SahilData = [
  {
    id: "profile",
    title: "About Me",
    icon: "i-ri:user-3-line",
    md: [
      {
        id: "about-me",
        title: "About Me",
        file: "markdown/about-me.md",
        icon: "i-ri:user-3-line",
        excerpt: "A brief introduction about myself and my background",
      }
    ],
  },
  {
    id: "project",
    title: "Projects",
    icon: "i-ri:code-s-slash-line",
    md: [
      {
        id: "summerease",
        title: "SummerEase",
        file: "markdown/project1.md",
        icon: "i-ri:file-text-line",
        excerpt: "AI-powered document summarizer built with Next.js, OpenAI & Gemini",
        link: "https://github.com/sahxzm/summerease"
      },
      {
        id: "silentwatch",
        title: "SilentWatch",
        file: "markdown/project2.md",
        icon: "i-ri:shield-check-line",
        excerpt: "Windows-based cheating detection tool built with Electron + React + TypeScript",
        link: "https://github.com/sahxzm/silentwatch"
      }
    ],
  },
];

export default sahil;
