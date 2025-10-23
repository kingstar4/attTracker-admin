import React, { useState, useEffect } from "react";
import { HardHat, Hammer, Users } from "lucide-react";

type LoadingTheme = "dark" | "light";
type LoadingMode = "welcome" | "page";

interface LoadingProps {
  theme?: LoadingTheme;
  mode?: LoadingMode;
}

const Loading: React.FC<LoadingProps> = ({ theme = "dark", mode = "page" }) => {
  const [currentIcon, setCurrentIcon] = useState(0);

  const icons = [
    { Icon: HardHat, label: "Verifying credentials", color: "#f59e0b" },
    { Icon: Hammer, label: "Loading workspace", color: "#3b82f6" },
    { Icon: Users, label: "Preparing attendance", color: "#10b981" },
  ];

  useEffect(() => {
    const iconInterval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 1500);

    return () => {
      clearInterval(iconInterval);
    };
  }, []);

  const CurrentIcon = icons[currentIcon].Icon;
  const currentColor = icons[currentIcon].color;

  const bgClass =
    theme === "dark"
      ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      : "bg-gradient-to-br from-gray-50 via-white to-gray-100";

  const titleColor = theme === "dark" ? "text-white" : "text-gray-900";
  const circleBackground =
    theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";

  const dotInactiveColor = theme === "dark" ? "#475569" : "#d1d5db";

  return (
    <div className={`flex items-center justify-center min-h-screen ${bgClass}`}>
      <div className="text-center">
        <div className="relative mb-8">
          <div
            className="relative mx-auto rounded-full flex items-center justify-center animate-pulse"
            style={{
              width: "140px",
              height: "140px",
              backgroundColor: circleBackground,
              backdropFilter: "blur(10px)",
              boxShadow: `0 0 40px ${currentColor}40`,
            }}
          >
            <div
              className="transition-all duration-500"
              style={{
                animation: "iconBounce 1.5s ease-in-out infinite",
              }}
            >
              <CurrentIcon size={64} color={currentColor} strokeWidth={2} />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${titleColor} mb-2`}>
            {mode === "welcome" ? "Welcome back" : "Just a moment"}
          </h2>
          <p
            className="text-lg transition-all duration-500"
            style={{ color: currentColor }}
          >
            {icons[currentIcon].label}
          </p>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {icons.map((_, index) => (
            <div
              key={index}
              className="transition-all duration-300 rounded-full"
              style={{
                width: currentIcon === index ? "24px" : "8px",
                height: "8px",
                backgroundColor:
                  currentIcon === index ? currentColor : dotInactiveColor,
              }}
            />
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes iconBounce {
            0%, 100% {
              transform: scale(1) translateY(0);
            }
            50% {
              transform: scale(1.1) translateY(-10px);
            }
          }
        `,
        }}
      />
    </div>
  );
};

export default Loading;
