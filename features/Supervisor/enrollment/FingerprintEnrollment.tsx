"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useEnrollmentStore } from "@/store/useEnrollmentStore"
import { EmployeeInfoCard } from "./components/EmployeeInfoCard"
import { FingerDiagram } from "./components/FingerDiagram"
import { CapturePanel } from "./components/CapturePanel"
import { DeviceStatusCard } from "./components/DeviceStatusCard"
import { Progress } from "@/components/ui/progress"

export function FingerprintEnrollment() {
  const { toast } = useToast()
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const [selectedFingerToRemove, setSelectedFingerToRemove] = useState<{ hand: 'left' | 'right'; id: string } | null>(null)

  const {
    selectedEmployee,
    leftHand,
    rightHand,
    deviceStatus,
    isEnrolling,
    setSelectedEmployee,
    startCapture,
    addSample,
    removeFinger,
    resetHand,
    setDeviceStatus,
    resetEnrollment,
  } = useEnrollmentStore()

  // Check device support on mount
  useEffect(() => {
    const checkDeviceSupport = async () => {
      try {
        const supported = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        setDeviceStatus({ isSupported: supported })
      } catch (error) {
        setDeviceStatus({ isSupported: false, errorMessage: "Failed to check device support" })
      }
    }
    checkDeviceSupport()
  }, [setDeviceStatus])

  // Calculate total progress
  const requiredFingers = 6 // 3 per hand
  const enrolledRequired = leftHand.requiredEnrolled + rightHand.requiredEnrolled
  const progress = (enrolledRequired / requiredFingers) * 100

  const handleFingerClick = async (handId: 'left' | 'right', fingerId: string) => {
    if (!deviceStatus.isSupported) {
      toast({
        title: "Device Not Supported",
        description: "Your device doesn't support fingerprint enrollment.",
        variant: "destructive",
      })
      return
    }

    if (!selectedEmployee) {
      toast({
        title: "No Employee Selected",
        description: "Please select an employee first.",
        variant: "destructive",
      })
      return
    }

    try {
      startCapture(handId, fingerId)
      // Simulate fingerprint capture - replace with actual WebAuthn implementation
      await new Promise(resolve => setTimeout(resolve, 2000))
      addSample(handId, fingerId)
      
      toast({
        title: "Sample Captured",
        description: "Fingerprint sample captured successfully.",
      })
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description: "Failed to capture fingerprint. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveEnrollment = async () => {
    try {
      // Here you would implement the actual save logic
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Enrollment Saved",
        description: "Fingerprint enrollment has been saved successfully.",
      })
      resetEnrollment()
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save enrollment. Please try again.",
        variant: "destructive",
      })
    }
    setShowSaveDialog(false)
  }

  const handleRemoveFinger = (handId: 'left' | 'right', fingerId: string) => {
    setSelectedFingerToRemove({ hand: handId, id: fingerId })
    setShowRemoveDialog(true)
  }

  const confirmRemoveFinger = () => {
    if (selectedFingerToRemove) {
      removeFinger(selectedFingerToRemove.hand, selectedFingerToRemove.id)
      toast({
        title: "Finger Removed",
        description: "The finger enrollment has been removed.",
      })
    }
    setShowRemoveDialog(false)
    setSelectedFingerToRemove(null)
  }

  const canSave = enrolledRequired >= requiredFingers && selectedEmployee

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Fingerprint Enrollment</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <EmployeeInfoCard
            employee={selectedEmployee}
            onSelectEmployee={setSelectedEmployee}
          />

          <DeviceStatusCard
            isConnected={deviceStatus.isConnected}
            isSupported={deviceStatus.isSupported}
            errorMessage={deviceStatus.errorMessage}
          />

          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Enrollment Progress</h2>
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {enrolledRequired} of {requiredFingers} required fingers enrolled
            </p>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Hand */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Left Hand</h3>
              <FingerDiagram
                hand="left"
                fingers={leftHand.fingers}
                onFingerClick={(fingerId) => handleFingerClick('left', fingerId)}
              />
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => resetHand('left')}
              >
                Reset Left Hand
              </Button>
            </Card>

            {/* Right Hand */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Right Hand</h3>
              <FingerDiagram
                hand="right"
                fingers={rightHand.fingers}
                onFingerClick={(fingerId) => handleFingerClick('right', fingerId)}
              />
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => resetHand('right')}
              >
                Reset Right Hand
              </Button>
            </Card>
          </div>

          {/* Capture Panel */}
          {isEnrolling && (
            <Card className="p-4">
              <CapturePanel
                finger={leftHand.fingers.find(f => f.inProgress) ?? rightHand.fingers.find(f => f.inProgress) ?? null}
                isCapturing={isEnrolling}
                onRetry={() => {
                  const activeFinger = leftHand.fingers.find(f => f.inProgress) ?? rightHand.fingers.find(f => f.inProgress)
                  if (activeFinger) {
                    handleFingerClick(
                      leftHand.fingers.find(f => f.inProgress) ? 'left' : 'right',
                      activeFinger.id
                    )
                  }
                }}
                onRemove={() => {
                  const activeFinger = leftHand.fingers.find(f => f.inProgress) ?? rightHand.fingers.find(f => f.inProgress)
                  if (activeFinger) {
                    handleRemoveFinger(
                      leftHand.fingers.find(f => f.inProgress) ? 'left' : 'right',
                      activeFinger.id
                    )
                  }
                }}
              />
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="default"
              className="flex-1"
              disabled={!canSave}
              onClick={() => setShowSaveDialog(true)}
            >
              Save Enrollment
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => resetEnrollment()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Enrollment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save this fingerprint enrollment?
              This will store the templates and complete the enrollment process.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveEnrollment}>
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Finger Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Finger</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this finger's enrollment?
              You'll need to re-enroll it to complete the process.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveFinger}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
