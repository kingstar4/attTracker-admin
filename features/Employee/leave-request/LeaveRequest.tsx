import { LeaveRequestForm } from "./components/leave-request-form";
import { LeaveRequestHistory } from "./components/leave-request-history";

export default function LeaveRequestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leave Request</h1>
        <p className="text-muted-foreground">
          Submit and manage your leave requests
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LeaveRequestForm />
        <LeaveRequestHistory />
      </div>
    </div>
  );
}
