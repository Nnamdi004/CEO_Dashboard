"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store/use-workspace-store";
import { useWorkspace } from "@/hooks/use-workspace";
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
import { generateId } from "@/lib/utils";

const schema = z.object({
  clientId: z.string().min(1, "Select a client"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  amount: z.number().positive("Amount must be greater than 0"),
});
type FormValues = z.infer<typeof schema>;

export function CreateInvoiceDialog() {
  const [open, setOpen] = useState(false);
  const addInvoice = useWorkspaceStore((s) => s.addInvoice);
  const { dataset } = useWorkspace();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { issueDate: new Date().toISOString().slice(0, 10) },
  });

  function onSubmit(values: FormValues) {
    const client = dataset.clients.find((c) => c.id === values.clientId);
    if (!client) return;
    addInvoice({
      invoiceNumber: generateId("INV").toUpperCase(),
      clientId: client.id,
      clientName: client.name,
      issueDate: values.issueDate,
      dueDate: values.dueDate,
      amount: values.amount,
      status: "outstanding",
    });
    toast.success(`Invoice for ${client.name} created.`);
    reset({ issueDate: new Date().toISOString().slice(0, 10) });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="justify-start gap-2" />}>
        <FileText className="size-4 text-muted-foreground" />
        Create Invoice
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
          <DialogDescription>Issue a new invoice to a client.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="invoice-client">Client</FieldLabel>
              <Select value={watch("clientId")} onValueChange={(v) => setValue("clientId", v ?? "")}>
                <SelectTrigger id="invoice-client" className="w-full">
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
                <FieldLabel htmlFor="invoice-issue">Issue date</FieldLabel>
                <Input id="invoice-issue" type="date" {...register("issueDate")} />
                <FieldError errors={[errors.issueDate]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="invoice-due">Due date</FieldLabel>
                <Input id="invoice-due" type="date" {...register("dueDate")} />
                <FieldError errors={[errors.dueDate]} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="invoice-amount">Amount (₦)</FieldLabel>
              <Input id="invoice-amount" type="number" step="1" placeholder="1500000" {...register("amount", { valueAsNumber: true })} />
              <FieldError errors={[errors.amount]} />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={isSubmitting}>
              Create Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
