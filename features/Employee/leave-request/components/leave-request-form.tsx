"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmployeeModuleStore } from "@/store/useEmployeeModuleStore";
import { useToast } from "@/hooks/use-toast";
import { CalendarClock, Send } from "lucide-react";

const leaveReasons = [
  "Medical appointment",
  "Family emergency",
  "Site visit off-location",
  "Personal (short)",
  "Other",
];

export function LeaveRequestForm() {
  const [formData, setFormData] = useState({
    reason: "",
    expectedLeaveTime: "",
    details: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addLeaveRequest } = useEmployeeModuleStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.reason || !formData.expectedLeaveTime) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newRequest = {
        id: Date.now().toString(),
        reason: formData.reason,
        expectedLeaveTime: formData.expectedLeaveTime,
        details: formData.details,
        status: "pending" as const,
        submittedAt: new Date().toISOString(),
      };

      addLeaveRequest(newRequest);

      toast({
        title: "Request Submitted",
        description: "Your leave request has been submitted successfully.",
      });

      // Reset form
      setFormData({
        reason: "",
        expectedLeaveTime: "",
        details: "",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          Submit Leave Request
        </CardTitle>
        <CardDescription>
          Fill out the form below to request time off. All requests require
          supervisor approval.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reason Selection */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.reason}
              onValueChange={(value) => handleInputChange("reason", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a reason for your leave" />
              </SelectTrigger>
              <SelectContent>
                {leaveReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expected Leave Time */}
          <div className="space-y-2">
            <Label htmlFor="expectedLeaveTime">
              Expected Leave Time <span className="text-destructive">*</span>
            </Label>
            <Input
              id="expectedLeaveTime"
              type="datetime-local"
              value={formData.expectedLeaveTime}
              onChange={(e) =>
                handleInputChange("expectedLeaveTime", e.target.value)
              }
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {/* Additional Details */}
          <div className="space-y-2">
            <Label htmlFor="details">Additional Details</Label>
            <Textarea
              id="details"
              placeholder="Provide any additional information about your leave request..."
              value={formData.details}
              onChange={(e) => handleInputChange("details", e.target.value)}
              maxLength={500}
              rows={4}
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.details.length}/500 characters
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
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
  );
}
