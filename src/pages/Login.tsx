import React, { useState, useEffect } from "react";
import { user } from "~/configs";
import type { MacActions } from "~/types";
import { useStore } from "~/stores";
import { Lock, HelpCircle } from "lucide-react";

export default function Login(props: MacActions) {
  const { wallpaper, dark } = useStore();
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleLogin = () => {
    if (password || !user.password) {
      props.setLogin(true);
    }
  };

  return (
    <div
      className="relative h-screen w-full flex flex-col justify-between text-white"
      style={{
        backgroundImage: 'var(--wallpaper-bg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Top: Time & Date */}
      <div className="pt-20 text-center select-none">
        <div className="text-6xl font-semibold text-white drop-shadow-[0_2px_4px_rgba(23, 11, 11, 0.4)]">
          {formatTime(currentTime)}
        </div>
        <div className="text-lg font-normal text-white/90 mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
          {formatDate(currentTime)}
        </div>
      </div>

      {/* Bottom: User login */}
      <div className="pb-2 flex flex-col items-center space-y-3">
        {/* Avatar */}
        <div className="w-18 h-18 rounded-full overflow-hidden border border-white/40 shadow-lg">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Username */}
        <h1 className="text-md font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
          {user.name}
        </h1>

        {/* Password input */}
        <div
          className={`flex items-center justify-between w-80 px-2 py-1 rounded-full bg-white/20 backdrop-blur-md transition-all ${
            isFocused ? "ring-2 ring-white/20" : ""
          }`}
        >
          <Lock size={18} className="mr-2 text-white/70" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter Password"
            className="flex-1 bg-transparent text-white placeholder-white/70 focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <button className="ml-2 w-6 h-6 flex items-center justify-center rounded-full bg-white/30 hover:bg-white/40 transition">
            <HelpCircle size={14} className="text-white/80" />
          </button>
        </div>

        {/* Hint text */}
        <p className="text-sm text-white/90">
          For password, enter anything you want
        </p>
      </div>
    </div>
  );
}
