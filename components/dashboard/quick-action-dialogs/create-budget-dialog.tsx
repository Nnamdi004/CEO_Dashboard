"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Wallet } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store/use-workspace-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PERIODS = [
  { value: "annual", label: "Annual" },
  { value: "monthly", label: "Monthly" },
  { value: "department", label: "Department" },
  { value: "project", label: "Project" },
] as const;

const schema = z
  .object({
    name: z.string().min(2, "Budget name is required"),
    period: z.enum(["annual", "monthly", "department", "project"]),
    department: z.string().optional(),
    allocated: z.number().positive("Allocated amount must be greater than 0"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after the start date",
    path: ["endDate"],
  });
type FormValues = z.infer<typeof schema>;

export function CreateBudgetDialog() {
  const [open, setOpen] = useState(false);
  const addBudget = useWorkspaceStore((s) => s.addBudget);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { period: "monthly" },
  });

  function onSubmit(values: FormValues) {
    addBudget({
      name: values.name,
      period: values.period,
      department: values.department || undefined,
      allocated: values.allocated,
      spent: 0,
      startDate: values.startDate,
      endDate: values.endDate,
    });
    toast.success(`Budget "${values.name}" created.`);
    reset({ period: "monthly" });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="justify-start gap-2" />}>
        <Wallet className="size-4 text-muted-foreground" />
        Create Budget
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Budget</DialogTitle>
          <DialogDescription>Allocate a new annual, monthly, department or project budget.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="budget-name">Budget name</FieldLabel>
              <Input id="budget-name" placeholder="Marketing — August 2026" {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="budget-period">Period</FieldLabel>
                <Select
                  value={watch("period")}
                  onValueChange={(v) => setValue("period", v as FormValues["period"])}
                >
                  <SelectTrigger id="budget-period" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PERIODS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="budget-department">Department (optional)</FieldLabel>
                <Input id="budget-department" placeholder="Operations" {...register("department")} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="budget-allocated">Allocated amount (₦)</FieldLabel>
              <Input id="budget-allocated" type="number" step="1" placeholder="5000000" {...register("allocated", { valueAsNumber: true })} />
              <FieldError errors={[errors.allocated]} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="budget-start">Start date</FieldLabel>
                <Input id="budget-start" type="date" {...register("startDate")} />
                <FieldError errors={[errors.startDate]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="budget-end">End date</FieldLabel>
                <Input id="budget-end" type="date" {...register("endDate")} />
                <FieldError errors={[errors.endDate]} />
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={isSubmitting}>
              Create Budget
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
