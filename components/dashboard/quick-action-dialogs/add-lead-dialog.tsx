"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Target } from "lucide-react";
import { useWorkspaceStore } from "@/lib/store/use-workspace-store";
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

const LEAD_SOURCES = ["Referral", "Website", "Trade Fair", "LinkedIn", "Cold Outreach"] as const;

const schema = z.object({
  company: z.string().min(2, "Company name is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  source: z.enum(LEAD_SOURCES),
  expectedValue: z.number().positive("Expected value must be greater than 0"),
  nextFollowUp: z.string().optional(),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function AddLeadDialog() {
  const [open, setOpen] = useState(false);
  const addLead = useWorkspaceStore((s) => s.addLead);
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
    defaultValues: { source: "Website" },
  });

  function onSubmit(values: FormValues) {
    addLead({
      company: values.company,
      contactPerson: values.contactPerson,
      email: values.email,
      phone: values.phone,
      source: values.source,
      expectedValue: values.expectedValue,
      status: "new",
      assignedExecutive: user.name,
      nextFollowUp: values.nextFollowUp || null,
      createdDate: new Date().toISOString().slice(0, 10),
      notes: values.notes,
    });
    toast.success(`Lead "${values.company}" added.`);
    reset({ source: "Website" });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="justify-start gap-2" />}>
        <Target className="size-4 text-muted-foreground" />
        Add Lead
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Lead</DialogTitle>
          <DialogDescription>Track a new business opportunity.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="lead-company">Company</FieldLabel>
              <Input id="lead-company" placeholder="Acme Retailers Ltd" {...register("company")} />
              <FieldError errors={[errors.company]} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="lead-contact">Contact person</FieldLabel>
                <Input id="lead-contact" placeholder="Jane Doe" {...register("contactPerson")} />
                <FieldError errors={[errors.contactPerson]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="lead-value">Expected value (₦)</FieldLabel>
                <Input id="lead-value" type="number" step="1" placeholder="2500000" {...register("expectedValue", { valueAsNumber: true })} />
                <FieldError errors={[errors.expectedValue]} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="lead-email">Email</FieldLabel>
                <Input id="lead-email" type="email" placeholder="jane@acme.ng" {...register("email")} />
                <FieldError errors={[errors.email]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="lead-phone">Phone</FieldLabel>
                <Input id="lead-phone" placeholder="+234 800 000 0000" {...register("phone")} />
                <FieldError errors={[errors.phone]} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="lead-source">Source</FieldLabel>
                <Select
                  value={watch("source")}
                  onValueChange={(v) => setValue("source", v as FormValues["source"])}
                >
                  <SelectTrigger id="lead-source" className="w-full">
                    <SelectValue placeholder="Select a source" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_SOURCES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="lead-followup">Next follow-up</FieldLabel>
                <Input id="lead-followup" type="date" {...register("nextFollowUp")} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="lead-notes">Notes</FieldLabel>
              <Textarea id="lead-notes" placeholder="Optional context…" {...register("notes")} />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={isSubmitting}>
              Add Lead
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
