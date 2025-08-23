import type { TerminalData } from "~/types";

const terminal: TerminalData[] = [
  {
    id: "about",
    title: "about",
    type: "folder",
    children: [
      {
        id: "about-me",
        title: "intro.txt",
        type: "file",
        content: (
          <div className="py-1">
            <div>
              Hello I am Sahil Singh. I am a Btech student pursuing my Btech in Electronics and Communication Engineering(2026).
            </div>
          </div>
        )
      },
      {
        id: "about-interests",
        title: "interests.txt",
        type: "file",
        content: " Aspiring software developer / full stack developement"
      },
      {
        id: "about-who-cares",
        title: "who-cares.txt",
        type: "file",
        content:
          "I'm looking for a SDE/web developer internship. I'm open to collaboration on full stack projects."
      },
      {
        id: "about-contact",
        title: "contact.txt",
        type: "file",
        content: (
          <ul className="list-disc ml-6">
            <li>
              Email:{" "}
              <a
                className="text-blue-300"
                href="sahilsingh0322@gmail.com"
                target="_blank"
                rel="noreferrer"
              >
                sahilsingh0322@gmail.com
              </a>
            </li>
            <li>
              Github:{" "}
              <a
                className="text-blue-300"
                href="https://github.com/sahxzm"
                target="_blank"
                rel="noreferrer"
              >
                @sahxzm
              </a>
            </li>
            <li>
              Linkedin:{" "}
              <a
                className="text-blue-300"
                href="https://www.linkedin.com/in/sahil-singh-0322"
                target="_blank"
                rel="noreferrer"
              >
                sahil-singh-0322
              </a>
            </li>
            <li>
              Personal Website:{" "}
              <a
                className="text-blue-300"
                href="https://sahilsingh0322.github.io/"
                target="_blank"
                rel="noreferrer"
              >
                https://sahilsingh0322.github.io/
              </a>
            </li>
          </ul>
        )
      }
    ]
  },
];

export default terminal;
