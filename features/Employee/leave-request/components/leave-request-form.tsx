"use client";

import type React from "react";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeaveRequestFormData {
  start_date: Date | undefined;
  end_date: Date | undefined;
  reason: string;
}
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEmployeeModuleStore } from "@/store/useEmployeeModuleStore";
import { useToast } from "@/hooks/use-toast";
import { CalendarClock, Send } from "lucide-react";

export function LeaveRequestForm() {
  const [formData, setFormData] = useState<LeaveRequestFormData>({
    start_date: undefined,
    end_date: undefined,
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addLeaveRequest } = useEmployeeModuleStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.start_date || !formData.end_date || !formData.reason.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate that end_date is not before start_date
    if (
      formData.end_date &&
      formData.start_date &&
      formData.end_date < formData.start_date
    ) {
      toast({
        title: "Validation Error",
        description: "End date cannot be before start date.",
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
        start_date: formData.start_date?.toISOString() ?? "",
        end_date: formData.end_date?.toISOString() ?? "",
        reason: formData.reason,
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
        start_date: undefined,
        end_date: undefined,
        reason: "",
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

  const handleInputChange = (
    field: keyof LeaveRequestFormData,
    value: Date | string
  ) => {
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
          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="start_date">
              Start Date <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.start_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.start_date ? (
                    format(formData.start_date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.start_date}
                  onSelect={(date: Date | undefined) =>
                    handleInputChange("start_date", date as Date)
                  }
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="end_date">
              End Date <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.end_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.end_date ? (
                    format(formData.end_date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.end_date}
                  onSelect={(date: Date | undefined) =>
                    handleInputChange("end_date", date as Date)
                  }
                  initialFocus
                  disabled={(date) =>
                    date < new Date() ||
                    (formData.start_date ? date < formData.start_date : false)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Family vacation"
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              maxLength={500}
              rows={4}
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.reason.length}/500 characters
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
