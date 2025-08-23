interface BootProps {
  restart: boolean;
  sleep: boolean;
  setBooting: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}

const loadingInterval = 1;
const bootingInterval = 500;

export default function Boot({ restart, sleep, setBooting }: BootProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [percent, setPercent] = useState<number>(0);

  useEffect(() => {
    if (restart || !sleep) {
      setLoading(true);
      setPercent(0);
    }
  }, [restart, sleep]);

  useInterval(
    () => {
      const newPercent = Math.min(percent + 1, 100);
      setPercent(newPercent);

      if (newPercent >= 100) {
        setTimeout(() => {
          setBooting(false);
        }, bootingInterval);
      }
    },
    loading ? loadingInterval : null
  );

  useEffect(() => {
    if (!loading) setLoading(true);
  }, []);

  const handleClick = () => {
    if (sleep) setBooting(false);
    else if (restart || loading) return;
    else setLoading(true);
  };

  return (
    <div className="size-full bg-black flex flex-col items-center justify-center">
      <div className="flex flex-col items-center transform transition-transform duration-500 hover:scale-105">
        <img
          src="/logo/appleicon.png"
          alt="Apple Logo"
          className="w-24 h-24 mb-6 animate-pulse"
        />
        {loading && (
          <div className="w-72 h-1 bg-gray-800/50 rounded-full overflow-hidden mt-4">
            <div
              className="h-full bg-white/90 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
