"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { type CapturePanelProps } from "../types"

export function CapturePanel({
  finger,
  isCapturing,
  onRetry,
  onRemove,
}: CapturePanelProps) {
  if (!finger) return null

  const progress = (finger.samples / finger.maxSamples) * 100

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Capturing {finger.name} Finger
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={isCapturing}
          >
            Retry
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onRemove}
            disabled={isCapturing}
          >
            Remove
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{finger.samples}/{finger.maxSamples} samples</span>
        </div>
        <Progress value={progress} />
      </div>

      <div className="bg-muted p-4 rounded-md">
        <p className="text-sm text-muted-foreground">
          {isCapturing
            ? "Place your finger on the scanner..."
            : "Click Retry to capture another sample or Remove to start over."}
        </p>
      </div>
    </div>
  )
}