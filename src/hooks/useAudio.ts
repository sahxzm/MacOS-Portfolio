export interface HTMLAudioState {
  volume: number;
  playing: boolean;
}

export interface HTMLAudioProps {
  src: string;
  autoReplay?: boolean;
}

export function useAudio(props: HTMLAudioProps) {
  const [state, setState] = useState<HTMLAudioState>({
    volume: 1,
    playing: false
  });

  const element = useRef<HTMLAudioElement>(new Audio(props.src));
  const ref = useRef<HTMLAudioElement>(element.current);

  const controls = {
    play: (): Promise<void> | void => {
      const el = element.current;
      if (el) {
        setState(prev => ({ ...prev, playing: true }));
        return el.play();
      }
    },

    pause: (): Promise<void> | void => {
      const el = element.current;
      if (el) {
        setState(prev => ({ ...prev, playing: false }));
        return el.pause();
      }
    },

    toggle: (): Promise<void> | void => {
      const el = element.current;
      if (el) {
        const promise = state.playing ? el.pause() : el.play();
        setState(prev => ({ ...prev, playing: !prev.playing }));
        return promise;
      }
    },

    volume: (value: number): void => {
      const el = element.current;
      if (el) {
        value = Math.min(1, Math.max(0, value));
        el.volume = value;
        setState(prev => ({ ...prev, volume: value }));
      }
    }
  };

  useEffect(() => {
    const el = element.current;
    if (!el) return;

    const handleEnded = () => {
      if (props.autoReplay) controls.play();
    };

    el.addEventListener("ended", handleEnded);

    // Initialize state
    setState({
      volume: el.volume,
      playing: !el.paused
    });

    return () => {
      el.pause();
      el.removeEventListener("ended", handleEnded);
      // Clean up the audio element when the component unmounts
      el.src = "";
    };
  }, [props.autoReplay, props.src]);

  return [element.current, state, controls, ref] as const;
}
