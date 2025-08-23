import { useMotionValue } from "framer-motion";
import { apps } from "~/configs";

interface DockProps {
  open: (id: string) => void;
  showApps: {
    [key: string]: boolean;
  };
  hide: boolean;
}

export default function Dock({
  open,
  showApps,
  hide
}: DockProps) {
  const { dockSize, dockMag } = useStore((state) => ({
    dockSize: state.dockSize,
    dockMag: state.dockMag
  }));

  const mouseX = useMotionValue<number | null>(null);

  return (
    <div
      className={`dock fixed left-1/2 -translate-x-1/2 bottom-1 ${hide ? "z-0" : "z-50"}`}
      style={{
        width: "fit-content",
        maxWidth: "calc(100% - 1rem)"
      }}
    >
      <ul
        className={`
          flex space-x-2 px-2
          backdrop-blur-2xl bg-white/15
          border border-white/20
          rounded-3xl

        `}
        onMouseMove={(e) => mouseX.set(e.nativeEvent.x)}
        onMouseLeave={() => mouseX.set(null)}
        style={{
          height: `${(dockSize + 15) / 16}rem`,
          willChange: "transform"
        }}
      >
        {apps
          .filter((app) => app.dock !== false)
          .map((app) => (
            <DockItem
              key={`dock-${app.id}`}
              id={app.id}
              title={app.title}
              img={app.img}
              mouseX={mouseX}
              desktop={app.desktop}
              openApp={open}
              isOpen={app.desktop && showApps[app.id]}
              link={app.link}
              dockSize={dockSize}
              dockMag={dockMag}
            />
          ))}
      </ul>
    </div>
  );
}
