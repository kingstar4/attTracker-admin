"use client";
import React, { useState, useEffect } from "react";
import { Shield, CheckCircle2, Lock } from "lucide-react";

const Validating = ({ theme = "dark" }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { Icon: Shield, label: "Validating session", scale: 1 },
    { Icon: Lock, label: "Securing connection", scale: 1.1 },
    { Icon: CheckCircle2, label: "Almost ready", scale: 1 },
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1000);

    return () => clearInterval(stepInterval);
  }, []);

  const CurrentIcon = steps[currentStep].Icon;
  const currentLabel = steps[currentStep].label;

  const bgClass =
    theme === "dark"
      ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      : "bg-gradient-to-br from-gray-50 via-white to-gray-100";

  const titleColor = theme === "dark" ? "text-white" : "text-gray-900";
  const subtitleColor = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const primaryColor = "oklch(0.72 0.15 45)";
  const secondaryColor = "oklch(0.65 0.18 35)";

  return (
    <div className={`flex items-center justify-center min-h-screen ${bgClass}`}>
      <div className="text-center">
        <div className="relative mb-8">
          {/* Ripple effect circles */}
          <div
            className="absolute rounded-full"
            style={{
              width: "200px",
              height: "200px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              border: `2px solid ${primaryColor}30`,
              animation: "ripple 2s ease-out infinite",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "200px",
              height: "200px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              border: `2px solid ${secondaryColor}30`,
              animation: "ripple 2s ease-out infinite 1s",
            }}
          />

          {/* Pulse glow ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: "140px",
              height: "140px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, ${primaryColor}40 0%, transparent 70%)`,
              animation: "pulseGlow 2s ease-in-out infinite",
            }}
          />

          {/* Main icon container */}
          <div
            className="relative mx-auto rounded-full flex items-center justify-center"
            style={{
              width: "120px",
              height: "120px",
              background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`,
              backdropFilter: "blur(10px)",
              boxShadow: `0 0 50px ${primaryColor}30`,
              border: `1px solid ${primaryColor}40`,
              animation: "softPulse 2s ease-in-out infinite",
            }}
          >
            <div
              className="transition-all duration-500"
              style={{
                animation: "iconFloat 2s ease-in-out infinite",
              }}
            >
              <CurrentIcon size={56} color={primaryColor} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${titleColor} mb-2`}>
            {currentLabel}
          </h2>
          <p className={`text-sm ${subtitleColor}`}>Please wait a moment</p>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="rounded-full"
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: primaryColor,
                animation: `dotPulse 1.5s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`,
                opacity: 0.4,
              }}
            />
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes ripple {
            0% {
              transform: translate(-50%, -50%) scale(0.8);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(1.5);
              opacity: 0;
            }
          }

          @keyframes iconFloat {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-8px) rotate(5deg);
            }
          }

          @keyframes dotPulse {
            0%, 100% {
              opacity: 0.4;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.3);
            }
          }

          @keyframes softPulse {
            0%, 100% {
              box-shadow: 0 0 25px ${primaryColor}30, 0 0 50px ${secondaryColor}10;
              transform: scale(1);
            }
            50% {
              box-shadow: 0 0 50px ${primaryColor}50, 0 0 100px ${secondaryColor}30;
              transform: scale(1.05);
            }
          }

          @keyframes pulseGlow {
            0%, 100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.4;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.15);
              opacity: 0.8;
            }
          }
        `,
        }}
      />
    </div>
  );
};

export default Validating;
