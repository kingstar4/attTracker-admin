import { create } from 'zustand'

export type Finger = {
  id: string
  name: string
  required: boolean
  enrolled: boolean
  inProgress: boolean
  samples: number
  maxSamples: number
}

export type Hand = {
  fingers: Finger[]
  totalEnrolled: number
  requiredEnrolled: number
}

export type Employee = {
  id: string
  fullName: string
  employeeId: string
  department: string
  role: string
  site: string
}

type DeviceStatus = {
  isConnected: boolean
  isSupported: boolean
  errorMessage?: string
}

interface EnrollmentState {
  selectedEmployee: Employee | null
  leftHand: Hand
  rightHand: Hand
  deviceStatus: DeviceStatus
  isEnrolling: boolean
  
  // Actions
  setSelectedEmployee: (employee: Employee | null) => void
  startCapture: (handId: 'left' | 'right', fingerId: string) => void
  addSample: (handId: 'left' | 'right', fingerId: string) => void
  removeFinger: (handId: 'left' | 'right', fingerId: string) => void
  resetHand: (handId: 'left' | 'right') => void
  setDeviceStatus: (status: Partial<DeviceStatus>) => void
  resetEnrollment: () => void
}

const initialHand = (side: 'left' | 'right'): Hand => ({
  fingers: [
    { id: `${side}-thumb`, name: 'Thumb', required: true, enrolled: false, inProgress: false, samples: 0, maxSamples: 3 },
    { id: `${side}-index`, name: 'Index', required: true, enrolled: false, inProgress: false, samples: 0, maxSamples: 3 },
    { id: `${side}-middle`, name: 'Middle', required: true, enrolled: false, inProgress: false, samples: 0, maxSamples: 3 },
    { id: `${side}-ring`, name: 'Ring', required: false, enrolled: false, inProgress: false, samples: 0, maxSamples: 3 },
    { id: `${side}-pinky`, name: 'Pinky', required: false, enrolled: false, inProgress: false, samples: 0, maxSamples: 3 },
  ],
  totalEnrolled: 0,
  requiredEnrolled: 0,
})

export const useEnrollmentStore = create<EnrollmentState>()((set) => ({
  selectedEmployee: null,
  leftHand: initialHand('left'),
  rightHand: initialHand('right'),
  deviceStatus: {
    isConnected: false,
    isSupported: false,
  },
  isEnrolling: false,

  setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),

  startCapture: (handId, fingerId) => set((state) => {
    const hand = handId === 'left' ? state.leftHand : state.rightHand
    const updatedFingers = hand.fingers.map((finger) => 
      finger.id === fingerId ? { ...finger, inProgress: true } : finger
    )
    
    return {
      [handId === 'left' ? 'leftHand' : 'rightHand']: {
        ...hand,
        fingers: updatedFingers,
      },
      isEnrolling: true,
    }
  }),

  addSample: (handId, fingerId) => set((state) => {
    const hand = handId === 'left' ? state.leftHand : state.rightHand
    let totalEnrolled = hand.totalEnrolled
    let requiredEnrolled = hand.requiredEnrolled

    const updatedFingers = hand.fingers.map((finger) => {
      if (finger.id === fingerId) {
        const newSamples = finger.samples + 1
        const isComplete = newSamples === finger.maxSamples
        if (isComplete && !finger.enrolled) {
          totalEnrolled++
          if (finger.required) requiredEnrolled++
        }
        return {
          ...finger,
          samples: newSamples,
          enrolled: isComplete,
          inProgress: !isComplete,
        }
      }
      return finger
    })

    return {
      [handId === 'left' ? 'leftHand' : 'rightHand']: {
        ...hand,
        fingers: updatedFingers,
        totalEnrolled,
        requiredEnrolled,
      },
      isEnrolling: false,
    }
  }),

  removeFinger: (handId, fingerId) => set((state) => {
    const hand = handId === 'left' ? state.leftHand : state.rightHand
    let totalEnrolled = hand.totalEnrolled
    let requiredEnrolled = hand.requiredEnrolled

    const updatedFingers = hand.fingers.map((finger) => {
      if (finger.id === fingerId && finger.enrolled) {
        totalEnrolled--
        if (finger.required) requiredEnrolled--
        return {
          ...finger,
          enrolled: false,
          inProgress: false,
          samples: 0,
        }
      }
      return finger
    })

    return {
      [handId === 'left' ? 'leftHand' : 'rightHand']: {
        ...hand,
        fingers: updatedFingers,
        totalEnrolled,
        requiredEnrolled,
      },
    }
  }),

  resetHand: (handId) => set((state) => ({
    [handId === 'left' ? 'leftHand' : 'rightHand']: initialHand(handId),
  })),

  setDeviceStatus: (status) => set((state) => ({
    deviceStatus: { ...state.deviceStatus, ...status },
  })),

  resetEnrollment: () => set({
    selectedEmployee: null,
    leftHand: initialHand('left'),
    rightHand: initialHand('right'),
    isEnrolling: false,
  }),
}))