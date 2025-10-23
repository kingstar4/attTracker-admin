"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useEmployeeModuleStore } from "@/store/useEmployeeModuleStore";

const formatDisplayDate = (date: string) => {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return format(parsed, "eee, MMM d yyyy");
};

const statusColor = (status: string) => {
  switch (status) {
    case "present":
      return "bg-green-500 hover:bg-green-600 text-white";
    case "absent":
      return "bg-red-500 hover:bg-red-600 text-white";
    case "late":
      return "bg-yellow-500 hover:bg-yellow-600 text-white";
    case "leave":
      return "bg-blue-500 hover:bg-blue-600 text-white";
    default:
      return "bg-gray-500 hover:bg-gray-600 text-white";
  }
};

const toApiDate = (date?: Date) => {
  if (!date) return "";
  return date.toISOString().split("T")[0];
};

const sameDay = (a?: Date, b?: Date) => {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

export function AttendanceHistory() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const {
    attendanceHistory,
    attendanceHistoryLoading,
    attendanceHistoryError,
    attendanceHistoryFilters,
    fetchAttendanceHistory,
  } = useEmployeeModuleStore();

  useEffect(() => {
    const start = attendanceHistoryFilters?.startDate;
    const end = attendanceHistoryFilters?.endDate;

    if (start) {
      const parsed = new Date(start);
      if (!Number.isNaN(parsed.getTime()) && !sameDay(parsed, startDate)) {
        setStartDate(parsed);
      }
    }

    if (end) {
      const parsed = new Date(end);
      if (!Number.isNaN(parsed.getTime()) && !sameDay(parsed, endDate)) {
        setEndDate(parsed);
      }
    }
  }, [attendanceHistoryFilters?.startDate, attendanceHistoryFilters?.endDate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!startDate || !endDate) return;
    await fetchAttendanceHistory(toApiDate(startDate), toApiDate(endDate));
  };

  const hasSearched = Boolean(attendanceHistoryFilters);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-3 md:items-end"
          >
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-muted-foreground"
                htmlFor="history-start-date"
              >
                Start Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="history-start-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => setStartDate(date ?? undefined)}
                    initialFocus
                    disabled={(date) => (endDate ? date > endDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-muted-foreground"
                htmlFor="history-end-date"
              >
                End Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="history-end-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => setEndDate(date ?? undefined)}
                    initialFocus
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!startDate || !endDate || attendanceHistoryLoading}
            >
              {attendanceHistoryLoading ? "Loading..." : "View History"}
            </Button>
          </form>
          {attendanceHistoryFilters && (
            <p className="text-xs text-muted-foreground mt-3">
              Showing records between{" "}
              <span className="font-medium">
                {formatDisplayDate(attendanceHistoryFilters.startDate ?? "")}
              </span>{" "}
              and{" "}
              <span className="font-medium">
                {formatDisplayDate(attendanceHistoryFilters.endDate ?? "")}
              </span>
              .
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          {attendanceHistoryError ? (
            <div className="rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
              {attendanceHistoryError}
            </div>
          ) : attendanceHistoryLoading ? (
            <div className="h-32 w-full animate-pulse rounded-md bg-muted" />
          ) : attendanceHistory.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {hasSearched
                ? "No attendance records found for the selected period."
                : "Select a date range to view your attendance history."}
            </p>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="px-3 py-2 font-medium">Date</th>
                      <th className="px-3 py-2 font-medium">Clock In</th>
                      <th className="px-3 py-2 font-medium">Clock Out</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceHistory.map((record) => (
                      <tr key={record.id} className="border-b">
                        <td className="whitespace-nowrap px-3 py-3">
                          {formatDisplayDate(record.date)}
                        </td>
                        <td className="px-3 py-3">{record.clockIn || "-"}</td>
                        <td className="px-3 py-3">{record.clockOut || "-"}</td>
                        <td className="px-3 py-3">
                          <Badge
                            className={cn(
                              "capitalize",
                              statusColor(record.status)
                            )}
                          >
                            {record.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 md:hidden">
                {attendanceHistory.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-lg border border-border/70 bg-background p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold">
                        {formatDisplayDate(record.date)}
                      </p>
                      <Badge
                        className={cn(
                          "capitalize",
                          statusColor(record.status)
                        )}
                      >
                        {record.status}
                      </Badge>
                    </div>
                    <dl className="mt-3 space-y-2 text-xs text-muted-foreground">
                      <div className="flex justify-between gap-2">
                        <dt className="font-medium text-foreground">Clock In</dt>
                        <dd>{record.clockIn || "-"}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="font-medium text-foreground">
                          Clock Out
                        </dt>
                        <dd>{record.clockOut || "-"}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
