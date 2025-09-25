"use client"

import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { type DeviceStatusCardProps } from "../types"

export function DeviceStatusCard({
  isConnected,
  isSupported,
  errorMessage,
}: DeviceStatusCardProps) {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Device Status</h2>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm">
            Scanner: {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isSupported ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          <span className="text-sm">
            WebAuthn Support: {isSupported ? "Available" : "Not Available"}
          </span>
        </div>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  )
}