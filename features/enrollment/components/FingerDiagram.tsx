"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type FingerDiagramProps } from "../types"

export function FingerDiagram({ hand, fingers, onFingerClick }: FingerDiagramProps) {
  return (
    <div className={cn(
      "relative w-full aspect-square bg-background",
      hand === "right" && "transform scale-x-[-1]" // Mirror for right hand
    )}>
      {/* Hand SVG background - simplified representation */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.1 }}
      >
        {/* Add basic hand shape SVG path here */}
        <path
          d="M50,90 C30,90 20,70 20,50 C20,30 30,10 50,10 C70,10 80,30 80,50 C80,70 70,90 50,90"
          fill="currentColor"
        />
      </svg>

      {/* Finger buttons */}
      <div className="relative w-full h-full">
        {fingers.map((finger) => {
          const getFingerPosition = () => {
            switch (finger.name.toLowerCase()) {
              case 'thumb':
                return 'left-[10%] top-[50%]'
              case 'index':
                return 'left-[30%] top-[20%]'
              case 'middle':
                return 'left-[50%] top-[10%]'
              case 'ring':
                return 'left-[70%] top-[20%]'
              case 'pinky':
                return 'left-[90%] top-[30%]'
              default:
                return ''
            }
          }

          const getStatusColor = () => {
            if (finger.enrolled) return 'bg-green-500 hover:bg-green-600'
            if (finger.inProgress) return 'bg-yellow-500 hover:bg-yellow-600'
            return 'bg-gray-300 hover:bg-gray-400'
          }

          return (
            <Button
              key={finger.id}
              className={cn(
                "absolute transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full",
                getFingerPosition(),
                getStatusColor(),
                finger.required && !finger.enrolled && "ring-2 ring-red-500"
              )}
              onClick={() => onFingerClick(finger.id)}
              disabled={finger.enrolled || finger.inProgress}
            >
              <span className={cn(
                "text-xs font-medium",
                hand === "right" && "transform scale-x-[-1]" // Un-mirror text
              )}>
                {finger.enrolled ? '✓' : finger.samples + '/' + finger.maxSamples}
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}