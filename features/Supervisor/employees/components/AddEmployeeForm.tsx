"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEmployeeStore } from "@/store/useEmployeeStore"
import { Employee, CreateEmployeeDto, employeeFormSchema } from "@/types/employee"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface AddEmployeeFormProps {
  onSuccess?: () => void
}

export function AddEmployeeForm({ onSuccess }: AddEmployeeFormProps) {
  const { createEmployee: addEmployee, isLoading, error, setError: clearError } = useEmployeeStore()
  const { toast } = useToast()
  
  const form = useForm<CreateEmployeeDto>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      nin: "",
      email: "",
      phone: "",
      address: "",
    },
  })

  const onSubmit = async (data: CreateEmployeeDto) => {
    try {
      await addEmployee(data)
      toast({
        title: "Success",
        description: "Employee created and email sent.",
      })
      form.reset()
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create employee",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md mx-auto">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>National ID Number (NIN)</FormLabel>
              <FormControl>
                <Input placeholder="12345678901" maxLength={11} {...field} />
              </FormControl>
              <FormDescription>
                11-digit National Identification Number
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+234 123 456 7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address / Location</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter employee's address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Add Employee"}
        </Button>
      </form>
    </Form>
  )
}