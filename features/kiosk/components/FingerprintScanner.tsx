"use client"

import { useState } from "react"
import { Fingerprint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAttendanceStore } from "@/store/useAttendanceStore"

interface FingerprintScannerProps {
  onScan: (employeeId: string) => void
}

export function FingerprintScanner({ onScan }: FingerprintScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanAnimation, setScanAnimation] = useState(false)
  const { employees } = useAttendanceStore()

  const simulateScan = () => {
    setIsScanning(true)
    setScanAnimation(true)

    // Simulate scanning process
    setTimeout(() => {
      // Randomly select an enrolled employee for demo
      const enrolledEmployees = employees.filter((emp) => emp.fingerprintEnrolled)
      if (enrolledEmployees.length > 0) {
        const randomEmployee = enrolledEmployees[Math.floor(Math.random() * enrolledEmployees.length)]
        onScan(randomEmployee.id)
      } else {
        // Simulate failed scan if no enrolled employees
        onScan("unknown")
      }

      setIsScanning(false)
      setScanAnimation(false)
    }, 2000)
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        <div
          className={`w-32 h-32 rounded-full border-4 border-blue-500 flex items-center justify-center transition-all duration-300 ${
            scanAnimation ? "animate-pulse bg-blue-50 dark:bg-blue-950" : "bg-background"
          }`}
        >
          <Fingerprint
            className={`h-16 w-16 transition-colors duration-300 ${
              scanAnimation ? "text-blue-600" : "text-muted-foreground"
            }`}
          />
        </div>

        {scanAnimation && <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping" />}
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">{isScanning ? "Scanning..." : "Place Finger on Scanner"}</h3>
        <p className="text-muted-foreground">
          {isScanning
            ? "Please hold still while we verify your identity"
            : "Press the scanner area to simulate fingerprint scanning"}
        </p>
      </div>

      <Button onClick={simulateScan} disabled={isScanning} size="lg" className="w-full max-w-xs h-12">
        <Fingerprint className="h-5 w-5 mr-2" />
        {isScanning ? "Scanning..." : "Scan Fingerprint"}
      </Button>
    </div>
  )
}
