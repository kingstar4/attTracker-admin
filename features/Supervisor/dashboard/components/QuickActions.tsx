"use client";

import { Button } from "@/components/ui/button";
import { Plus, Download, Settings, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AddEmployeeForm } from "../../employees/components/AddEmployeeForm";
// import { useEmployeeStore } from "@/store/useEmployeeStore";

export function QuickActions() {
  const router = useRouter();
  // const { fetchEmployees } = useEmployeeStore();

  return (
    <div className="flex items-center gap-2">
      <AddEmployeeForm
        trigger={
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        }
        // onSuccess={() => fetchEmployees()}
      />
      <Button variant="outline" size="sm">
        <Download className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm">
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push("/settings")}
      >
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
}
