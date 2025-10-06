import { GeofenceStatus } from "./components/geofence-status";
import { OTPGenerator } from "./components/otp-generator";
import { OTPInfo } from "./components/otp-info";

export function OtpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">OTP Fallback</h1>
        <p className="text-muted-foreground">
          Generate one-time password for attendance when biometric kiosk is
          unavailable
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <GeofenceStatus />
          <OTPGenerator />
        </div>

        <div>
          <OTPInfo />
        </div>
      </div>
    </div>
  );
}
