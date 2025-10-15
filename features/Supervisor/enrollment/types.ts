import { type Employee, type Finger } from "@/store/useEnrollmentStore"

export interface EmployeeInfoCardProps {
  employee: Employee | null
  onSelectEmployee: (employee: Employee) => void
}

export interface FingerDiagramProps {
  hand: 'left' | 'right'
  fingers: Finger[]
  onFingerClick: (fingerId: string) => void
}

export interface CapturePanelProps {
  finger: Finger | null | undefined
  isCapturing: boolean
  onRetry: () => void
  onRemove: () => void
}

export interface DeviceStatusCardProps {
  isConnected: boolean
  isSupported: boolean
  errorMessage?: string
}