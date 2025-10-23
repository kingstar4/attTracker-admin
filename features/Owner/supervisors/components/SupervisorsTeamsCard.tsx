"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Users, UserCircle2 } from "lucide-react";
import type { OwnerSupervisorRecord } from "@/store/useOwnerSupervisorsStore";
import { cn } from "@/lib/utils";

interface SupervisorsTeamsCardProps {
  loading: boolean;
  supervisors: OwnerSupervisorRecord[];
  supervisorsByOrg: Array<{
    organizationName: string;
    supervisors: OwnerSupervisorRecord[];
  }>;
  statusVariant: (
    status: OwnerSupervisorRecord["status"]
  ) => "default" | "secondary";
}

const sectionOutline =
  "rounded-md border border-border/60 bg-muted/20 shadow-sm transition hover:border-border";

export function SupervisorsTeamsCard({
  loading,
  supervisors,
  supervisorsByOrg,
  statusVariant,
}: SupervisorsTeamsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Users className="h-5 w-5 text-muted-foreground" />
          Supervisors &amp; Teams
        </CardTitle>
        <CardDescription>
          Explore every supervisor grouped by organization and drill into the
          employees assigned to them.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && supervisors.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full rounded-md" />
            ))}
          </div>
        ) : supervisors.length > 0 ? (
          <Accordion type="multiple" className="space-y-4">
            {supervisorsByOrg.map(
              ({ organizationName, supervisors: orgSupervisors }) => (
                <AccordionItem
                  key={organizationName}
                  value={organizationName}
                  className={cn(sectionOutline, "px-2")}
                >
                  <AccordionTrigger className="gap-2 px-3 py-3 text-sm font-semibold">
                    <div className="flex flex-1 flex-col gap-1 text-left">
                      <span>{organizationName}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {orgSupervisors.length} supervisor
                        {orgSupervisors.length === 1 ? "" : "s"} listed
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-2 pb-4">
                    <Accordion type="multiple" className="space-y-3">
                      {orgSupervisors.map((supervisor) => (
                        <AccordionItem
                          key={supervisor.id}
                          value={supervisor.id}
                          className={cn(
                            sectionOutline,
                            "border-muted bg-background px-2 py-1"
                          )}
                        >
                          <AccordionTrigger className="px-3 py-2 text-sm font-medium">
                            <div className="flex flex-1 flex-col gap-3 text-left sm:flex-row sm:items-center sm:justify-between">
                              <div className="space-y-1 sm:max-w-[65%]">
                                <p className="flex items-center gap-2 text-sm font-semibold">
                                  <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                                  {supervisor.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {supervisor.email || "Email unavailable"}
                                </p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                <Badge
                                  variant={statusVariant(supervisor.status)}
                                  className="capitalize"
                                >
                                  {supervisor.status}
                                </Badge>
                                <div className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                  {supervisor.employees.length}{" "}
                                  {supervisor.employees.length === 1
                                    ? "employee"
                                    : "employees"}
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-3 pb-3">
                            {supervisor.employees.length > 0 ? (
                              <ul className="space-y-2">
                                {supervisor.employees.map((employee) => (
                                  <li
                                    key={employee.id}
                                    className="flex flex-col gap-3 rounded-md border border-border/50 bg-muted/20 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                                  >
                                    <div>
                                      <p className="font-medium">
                                        {employee.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {employee.email || "Email unavailable"}
                                      </p>
                                    </div>
                                    <Badge
                                      variant={statusVariant(employee.status)}
                                      className="capitalize"
                                    >
                                      {employee.status}
                                    </Badge>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="rounded-md border border-dashed border-border/60 bg-muted/10 px-3 py-2 text-xs text-muted-foreground">
                                No employees are currently assigned to this
                                supervisor.
                              </p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              )
            )}
          </Accordion>
        ) : (
          <p className="text-sm text-muted-foreground">
            No supervisors were found for this owner. Once you invite
            supervisors they will appear here.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
