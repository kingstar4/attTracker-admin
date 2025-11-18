"use client"

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
  UserRound,
  Users,
  Clock,
} from "lucide-react"
import {
  SupervisorProfileUpdatePayload,
  useSupervisorProfileStore,
} from "@/store/useSupervisorProfileStore"

const formatTimestamp = (value?: string | null) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function SupervisorProfile() {
  const {
    profile,
    account,
    loading,
    error,
    fetchProfile,
    updating,
    updateProfile,
    updateError,
    lastSavedAt,
    lastFetchedAt,
  } = useSupervisorProfileStore()

  const [formValues, setFormValues] = useState<SupervisorProfileUpdatePayload>({
    phone_number: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    address: "",
  })

  const fullName = useMemo(() => {
    const fallback = account?.full_name ?? account?.email ?? "Supervisor account"
    if (!profile) return fallback
    const name = [profile.first_name, profile.last_name]
      .filter(Boolean)
      .join(" ")
      .trim()
    return name || fallback
  }, [profile?.first_name, profile?.last_name, account?.full_name, account?.email, profile])

  useEffect(() => {
    console.log("SupervisorProfile component mounted, calling fetchProfile")
    void fetchProfile()
  }, [])

  useEffect(() => {
    setFormValues({
      phone_number: profile?.phone_number ?? "",
      emergency_contact_name: profile?.emergency_contact_name ?? "",
      emergency_contact_phone: profile?.emergency_contact_phone ?? "",
      address: profile?.address ?? "",
    })
  }, [
    profile?.phone_number,
    profile?.emergency_contact_name,
    profile?.emergency_contact_phone,
    profile?.address,
  ])

  const handleChange =
    (field: keyof SupervisorProfileUpdatePayload) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = event.target
        setFormValues((prev) => ({ ...prev, [field]: value }))
      }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void updateProfile(formValues)
  }

  const infoGrid = (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex items-start gap-3 rounded-lg border p-3">
        <UserRound className="h-5 w-5 text-primary" />
        <div>
          <p className="text-xs uppercase text-muted-foreground">Full name</p>
          <p className="text-sm font-medium">{fullName}</p>
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-lg border p-3">
        <Mail className="h-5 w-5 text-primary" />
        <div>
          <p className="text-xs uppercase text-muted-foreground">Email</p>
          <p className="text-sm font-medium">
            {account?.email ?? "Not available"}
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-lg border p-3">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <div>
          <p className="text-xs uppercase text-muted-foreground">Role</p>
          <p className="text-sm font-medium">
            {account?.role ?? "Supervisor"}
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-lg border p-3">
        <Phone className="h-5 w-5 text-primary" />
        <div>
          <p className="text-xs uppercase text-muted-foreground">Phone</p>
          <p className="text-sm font-medium">
            {profile?.phone_number || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  )

  const teamSummary = account?.team_summary
  const showSkeleton = loading && !profile

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Supervisor Profile</h1>
        <p className="text-sm text-muted-foreground">
          Review and update your profile information and team details.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load profile</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Account overview</CardTitle>
          <CardDescription>
            Details synced from your organization records.
            {lastFetchedAt ? (
              <span className="ml-1 text-xs text-muted-foreground/80">
                Updated {formatTimestamp(lastFetchedAt)}
              </span>
            ) : null}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showSkeleton ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            infoGrid
          )}
        </CardContent>
      </Card>

      {teamSummary && (
        <Card>
          <CardHeader>
            <CardTitle>Team summary</CardTitle>
            <CardDescription>
              Overview of your team's current status.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase text-muted-foreground">Team size</p>
                <p className="text-sm font-medium">{teamSummary.team_size} employees</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase text-muted-foreground">Pending leave requests</p>
                <p className="text-sm font-medium">{teamSummary.pending_leave_requests}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contact & emergency details</CardTitle>
          <CardDescription>
            This information helps your organization reach you during incidents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formValues.phone_number ?? ""}
                  onChange={handleChange("phone_number")}
                  placeholder="+1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Office address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formValues.address ?? ""}
                  onChange={handleChange("address")}
                  rows={3}
                  placeholder="Office address"
                />
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <UserCheck className="h-4 w-4 text-primary" />
                Emergency contact
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">Contact name</Label>
                  <Input
                    id="emergency_contact_name"
                    name="emergency_contact_name"
                    value={formValues.emergency_contact_name ?? ""}
                    onChange={handleChange("emergency_contact_name")}
                    placeholder="Full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">
                    Contact phone
                  </Label>
                  <Input
                    id="emergency_contact_phone"
                    name="emergency_contact_phone"
                    value={formValues.emergency_contact_phone ?? ""}
                    onChange={handleChange("emergency_contact_phone")}
                    placeholder="+1234567890"
                  />
                </div>
              </div>
            </div>

            {updateError ? (
              <Alert variant="destructive">
                <AlertTitle>Update failed</AlertTitle>
                <AlertDescription>{updateError}</AlertDescription>
              </Alert>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                className="w-full sm:w-fit"
                disabled={updating}
              >
                {updating ? "Saving..." : "Save changes"}
              </Button>
              {lastSavedAt ? (
                <p className="text-xs text-muted-foreground">
                  Last saved {formatTimestamp(lastSavedAt)}
                </p>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick reference</CardTitle>
          <CardDescription>
            Keep these details handy when working with your team.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1 rounded-lg border p-3">
            <p className="text-xs uppercase text-muted-foreground">Email</p>
            <p className="text-sm font-medium">
              {account?.email ?? "Not provided"}
            </p>
          </div>
          <div className="space-y-1 rounded-lg border p-3">
            <p className="text-xs uppercase text-muted-foreground">Phone</p>
            <p className="text-sm font-medium">
              {profile?.phone_number || "Not provided"}
            </p>
          </div>
          <div className="space-y-1 rounded-lg border p-3">
            <p className="text-xs uppercase text-muted-foreground">Address</p>
            <p className="text-sm font-medium">
              {profile?.address || "Not provided"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
