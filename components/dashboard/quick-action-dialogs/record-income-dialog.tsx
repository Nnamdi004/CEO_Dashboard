"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { TrendingUp } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store/use-workspace-store";
import { useWorkspace } from "@/hooks/use-workspace";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { generateId } from "@/lib/utils";

const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "card", label: "Card" },
  { value: "cash", label: "Cash" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
] as const;

const schema = z.object({
  clientId: z.string().min(1, "Select a client"),
  date: z.string().min(1, "Date is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  paymentMethod: z.enum(["bank_transfer", "card", "cash", "cheque", "other"]),
  referenceNumber: z.string().min(2, "Reference number is required"),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function RecordIncomeDialog() {
  const [open, setOpen] = useState(false);
  const addIncome = useWorkspaceStore((s) => s.addIncome);
  const { dataset } = useWorkspace();
  const { user } = useCurrentUser();

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
      paymentMethod: "bank_transfer",
    },
  });

  function onSubmit(values: FormValues) {
    const client = dataset.clients.find((c) => c.id === values.clientId);
    if (!client) return;
    addIncome({
      date: values.date,
      clientId: client.id,
      clientName: client.name,
      amount: values.amount,
      paymentMethod: values.paymentMethod,
      referenceNumber: values.referenceNumber,
      receivedBy: user.name,
      notes: values.notes,
    });
    toast.success(`Payment from ${client.name} recorded.`);
    reset({
      date: new Date().toISOString().slice(0, 10),
      paymentMethod: "bank_transfer",
      referenceNumber: generateId("TRX"),
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="justify-start gap-2" />}>
        <TrendingUp className="size-4 text-muted-foreground" />
        Record Income
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Income</DialogTitle>
          <DialogDescription>Log a payment received from a client.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="income-client">Client</FieldLabel>
              <Select value={watch("clientId")} onValueChange={(v) => setValue("clientId", v ?? "")}>
                <SelectTrigger id="income-client" className="w-full">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {dataset.clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.clientId]} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="income-date">Date</FieldLabel>
                <Input id="income-date" type="date" {...register("date")} />
                <FieldError errors={[errors.date]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="income-amount">Amount (₦)</FieldLabel>
                <Input id="income-amount" type="number" step="1" placeholder="500000" {...register("amount", { valueAsNumber: true })} />
                <FieldError errors={[errors.amount]} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="income-method">Payment method</FieldLabel>
                <Select
                  value={watch("paymentMethod")}
                  onValueChange={(v) => setValue("paymentMethod", v as FormValues["paymentMethod"])}
                >
                  <SelectTrigger id="income-method" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="income-ref">Reference number</FieldLabel>
                <Input id="income-ref" placeholder="TRX-00123" {...register("referenceNumber")} />
                <FieldError errors={[errors.referenceNumber]} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="income-notes">Notes</FieldLabel>
              <Textarea id="income-notes" placeholder="Optional context…" {...register("notes")} />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={isSubmitting}>
              Record Income
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
