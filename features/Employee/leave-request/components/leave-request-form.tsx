"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, CalendarClock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useEmployeeModuleStore } from "@/store/useEmployeeModuleStore"
import { useToast } from "@/hooks/use-toast"

interface LeaveRequestFormData {
  start_date: Date | undefined
  end_date: Date | undefined
  reason: string
}

const toApiDate = (date?: Date) => {
  if (!date) return ""
  return date.toISOString().split("T")[0]
}

export function LeaveRequestForm() {
  const [formData, setFormData] = useState<LeaveRequestFormData>({
    start_date: undefined,
    end_date: undefined,
    reason: "",
  })

  const { toast } = useToast()
  const submitLeaveRequest = useEmployeeModuleStore((state) => state.submitLeaveRequest)
  const fetchLeaveRequests = useEmployeeModuleStore((state) => state.fetchLeaveRequests)
  const leaveRequestSubmitting = useEmployeeModuleStore((state) => state.leaveRequestSubmitting)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!formData.start_date || !formData.end_date || !formData.reason.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (formData.end_date < formData.start_date) {
      toast({
        title: "Validation Error",
        description: "End date cannot be before start date.",
        variant: "destructive",
      })
      return
    }

    try {
      await submitLeaveRequest({
        start_date: toApiDate(formData.start_date),
        end_date: toApiDate(formData.end_date),
        reason: formData.reason.trim(),
      })
      await fetchLeaveRequests()

      toast({
        title: "Request Submitted",
        description: "Your leave request has been submitted successfully.",
      })

      setFormData({
        start_date: undefined,
        end_date: undefined,
        reason: "",
      })
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description:
          error?.response?.data?.message ??
          error?.message ??
          "Failed to submit request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: keyof LeaveRequestFormData, value: Date | string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          Submit Leave Request
        </CardTitle>
        <CardDescription>
          Fill out the form below to request time off. All requests require supervisor approval.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="leave-start-date">
              Start Date <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.start_date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.start_date ? format(formData.start_date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.start_date}
                  onSelect={(date) => handleInputChange("start_date", (date as Date) ?? undefined)}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leave-end-date">
              End Date <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.end_date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.end_date ? format(formData.end_date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.end_date}
                  onSelect={(date) => handleInputChange("end_date", (date as Date) ?? undefined)}
                  initialFocus
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                    (formData.start_date ? date < formData.start_date : false)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leave-reason">
              Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="leave-reason"
              placeholder="Family vacation"
              value={formData.reason}
              onChange={(event) => handleInputChange("reason", event.target.value)}
              maxLength={500}
              rows={4}
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.reason.length}/500 characters
            </div>
          </div>

          <Button type="submit" disabled={leaveRequestSubmitting} className="w-full">
            {leaveRequestSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
