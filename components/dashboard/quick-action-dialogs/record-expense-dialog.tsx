"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Receipt } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store/use-workspace-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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

const DEPARTMENTS = [
  "Operations",
  "Sales & Marketing",
  "Logistics",
  "IT",
  "HR",
  "Finance",
  "Fleet Operations",
  "Warehousing",
];

const schema = z.object({
  category: z.string().min(2, "Category is required"),
  department: z.string().min(1, "Select a department"),
  vendor: z.string().min(2, "Vendor is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  hasReceipt: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

export function RecordExpenseDialog() {
  const [open, setOpen] = useState(false);
  const addExpense = useWorkspaceStore((s) => s.addExpense);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      hasReceipt: false,
      department: DEPARTMENTS[0],
    },
  });

  function onSubmit(values: FormValues) {
    addExpense({
      category: values.category,
      department: values.department,
      vendor: values.vendor,
      amount: values.amount,
      date: values.date,
      status: "pending",
      hasReceipt: values.hasReceipt,
    });
    toast.success(`Expense for ${values.vendor} recorded.`);
    reset({ date: new Date().toISOString().slice(0, 10), hasReceipt: false, department: DEPARTMENTS[0] });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="justify-start gap-2" />}>
        <Receipt className="size-4 text-muted-foreground" />
        Record Expense
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Expense</DialogTitle>
          <DialogDescription>Log a new business expense for approval.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="expense-category">Category</FieldLabel>
                <Input id="expense-category" placeholder="Marketing" {...register("category")} />
                <FieldError errors={[errors.category]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="expense-vendor">Vendor</FieldLabel>
                <Input id="expense-vendor" placeholder="Bloom Digital Agency" {...register("vendor")} />
                <FieldError errors={[errors.vendor]} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="expense-department">Department</FieldLabel>
                <select
                  id="expense-department"
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  {...register("department")}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
              <Field>
                <FieldLabel htmlFor="expense-amount">Amount (₦)</FieldLabel>
                <Input id="expense-amount" type="number" step="1" placeholder="250000" {...register("amount", { valueAsNumber: true })} />
                <FieldError errors={[errors.amount]} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="expense-date">Date</FieldLabel>
              <Input id="expense-date" type="date" {...register("date")} />
              <FieldError errors={[errors.date]} />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="expense-receipt" className="flex-1">
                Receipt attached
              </FieldLabel>
              <Switch
                id="expense-receipt"
                checked={watch("hasReceipt")}
                onCheckedChange={(v) => setValue("hasReceipt", v)}
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={isSubmitting}>
              Record Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
