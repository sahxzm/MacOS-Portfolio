import React from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface TerminalState {
  content: JSX.Element[];
}

export default class Terminal extends React.Component<{}, TerminalState> {
  private history: string[] = [];
  private curHistory = 0;
  private curInputTimes = 0;

  private commands: {
    [key: string]: (arg?: string) => Promise<void>;
  };

  constructor(props: {}) {
    super(props);
    this.state = {
      content: []
    };

    this.commands = {
      help: this.help,
      profile: this.profile,
      projects: this.projects,
      resume: this.resume
    };
  }

  componentDidMount() {
      <div className="text-green-300">
      </div>
    ;
    this.generateInputRow(this.curInputTimes);
  }

  /** ---------------- UTILS ---------------- */
  addRow = (row: JSX.Element) => {
    this.setState((prev) => ({ content: [...prev.content, row] }));
  };

  generateInputRow = (id: number) => {
    const newRow = (
      <div key={`terminal-input-row-${id}`} className="flex">
        <div className="w-max flex space-x-1.5">
          <span className="text-yellow-200">
            @sahilMacOS <span className="text-green-300">~</span>
          </span>
          <span className="text-red-400">{'>'}</span>
        </div>
        <input
          id={`terminal-input-${id}`}
          className="flex-1 px-1 text-white outline-none bg-transparent"
          onKeyDown={this.keyPress}
          autoFocus
        />
      </div>
    );
    this.addRow(newRow);
  };

  generateResultRow = (id: number, result: JSX.Element) => {
    const newRow = (
      <div key={`terminal-result-row-${id}`} className="break-all">
        {result}
      </div>
    );
    this.addRow(newRow);
  };

  /** ---------------- COMMANDS ---------------- */
  help = async () => {
    const help = (
      <div>
        <div className="mb-1">Available Commands:</div>
        <ul className="list-disc ml-6 pb-2">
          <li>
            <span className="text-red-400">profile</span> - Show profile details
          </li>
          <li>
            <span className="text-red-400">projects</span> - Show projects
          </li>
          <li>
            <span className="text-red-400">resume</span> - Show resume link
          </li>
          <li>
            <span className="text-red-400">help</span> - Show this menu
          </li>
        </ul>
        <div className="mt-2 text-blue-300">
          Try asking me anything! I'll use Gemini AI to answer your questions or command apart from the above commands.
        </div>
      </div>
    );
    this.generateResultRow(this.curInputTimes, help);
  };

  profile = async () => {
    const response = (
      <div>
        <div className="text-blue-300">Name: Sahil Singh</div>
        <div className="text-blue-300">
          B.Tech in Electronics and Communication Engineering (2022–2026)
        </div>
        <div className="text-blue-300">
          Aspiring Software Developer | Full-Stack Developer
        </div>
      </div>
    );
    this.generateResultRow(this.curInputTimes, response);
  };

  projects = async () => {
    const response = (
      <div className="text-blue-300 space-y-1">
        <div>
          🚀 <b>Summerease</b> – AI Powered Document Summarizer (Next.js,
          LangChain, OpenAI, Stripe)
        </div>
        <div>
          🛡️ <b>SilentWatch</b> – Windows-based cheating detection tool
          (Electron + React + TypeScript)
        </div>
        <div>⚡ Hackathon Projects</div>
        <div>
          GitHub:{" "}
          <a
            href="https://github.com/sahxzm"
            target="_blank"
            rel="noreferrer"
            className="text-green-300 underline"
          >
            @sahxzm
          </a>
        </div>
      </div>
    );
    this.generateResultRow(this.curInputTimes, response);
  };

  resume = async () => {
    const response = (
      <div className="text-blue-300">
        You can view my resume here:{" "}
        <a
          href="https://drive.google.com/drive/folders/1oWWCXUaJmtXeAAKhIJsq-pS5p9P5G18t?usp=sharing"
          target="_blank"
          rel="noreferrer"
          className="text-green-300 underline"
        >
          Resume Link
        </a>
      </div>
    );
    this.generateResultRow(this.curInputTimes, response);
  };

  private async handleAICommand(prompt: string) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      this.generateResultRow(
        this.curInputTimes,
        <div className="text-yellow-400">
          Error: Gemini API key is not set. Please check your .env file.
        </div>
      );
      return;
    }

    try {
      // Show typing indicator
      const loadingId = this.curInputTimes;
      const loadingRow = (
        <div key={`ai-loading-${loadingId}`} className="text-blue-300">
          Thinking...
        </div>
      );
      this.addRow(loadingRow);

      // Initialize Gemini with API key and generate response
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Remove loading indicator and show response
      this.setState(prev => ({
        content: prev.content.filter(row => row.key !== `ai-loading-${loadingId}`)
      }));

      this.generateResultRow(
        this.curInputTimes,
        <div className="text-blue-300">{text}</div>
      );
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.generateResultRow(
        this.curInputTimes,
        <div className="text-red-400">
          Sorry, I encountered an error: {errorMessage}
        </div>
      );
    }
  }

  keyPress = async (e: React.KeyboardEvent) => {
    const inputElement = e.currentTarget as HTMLInputElement;
    const inputText = inputElement.value.trim();
    const [cmd, ...args] = inputText.split(" ");
    const fullCommand = args.length > 0 ? `${cmd} ${args.join(' ')}` : cmd;

    if (e.key === "Enter") {
      this.history.push(inputText);
      inputElement.setAttribute("readonly", "true");

      if (cmd && Object.keys(this.commands).includes(cmd)) {
        await this.commands[cmd](args.join(' '));
      } else if (cmd) {
        // Use Gemini AI for unknown commands
        await this.handleAICommand(fullCommand);
      }

      this.curHistory = this.history.length;
      this.curInputTimes += 1;
      this.generateInputRow(this.curInputTimes);
    } else if (e.key === "ArrowUp") {
      if (this.history.length > 0) {
        if (this.curHistory > 0) this.curHistory--;
        inputElement.value = this.history[this.curHistory];
      }
    } else if (e.key === "ArrowDown") {
      if (this.history.length > 0) {
        if (this.curHistory < this.history.length) this.curHistory++;
        if (this.curHistory === this.history.length) inputElement.value = "";
        else inputElement.value = this.history[this.curHistory];
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  focusOnInput = (id: number) => {
    const input = document.querySelector(
      `#terminal-input-${id}`
    ) as HTMLInputElement;
    input?.focus();
  };

  render() {
    return (
      <div
        className="terminal font-terminal font-normal relative h-full bg-gray-800/90 overflow-y-scroll"
        text="white sm"
        onClick={() => this.focusOnInput(this.curInputTimes)}
      >
        <div className="p-2 text-white">
          Welcome! Type <span className="text-green-300">'help'</span> to see available commands.
        </div>
        <div id="terminal-content" className="px-1.5 pb-2">
          {this.state.content}
        </div>
      </div>
    );
  }
}
