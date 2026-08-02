"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Headset } from "lucide-react";
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
import { generateId } from "@/lib/utils";

const PRIORITIES = ["low", "medium", "high", "critical"] as const;

const schema = z.object({
  issue: z.string().min(4, "Describe the issue"),
  category: z.string().min(2, "Category is required"),
  priority: z.enum(PRIORITIES),
});
type FormValues = z.infer<typeof schema>;

export function CreateITTicketDialog() {
  const [open, setOpen] = useState(false);
  const addITTicket = useWorkspaceStore((s) => s.addITTicket);
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
    defaultValues: { priority: "medium" },
  });

  function onSubmit(values: FormValues) {
    addITTicket({
      ticketNumber: generateId("TKT").toUpperCase(),
      reportedBy: user.name,
      issue: values.issue,
      category: values.category,
      priority: values.priority,
      status: "open",
      assignedTo: null,
      createdDate: new Date().toISOString().slice(0, 10),
      resolvedDate: null,
    });
    toast.success("IT ticket created.");
    reset({ priority: "medium" });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="justify-start gap-2" />}>
        <Headset className="size-4 text-muted-foreground" />
        Create IT Ticket
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create IT Ticket</DialogTitle>
          <DialogDescription>Report a technical issue to the IT team.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="ticket-issue">Issue</FieldLabel>
              <Textarea id="ticket-issue" placeholder="Describe what's going wrong…" {...register("issue")} />
              <FieldError errors={[errors.issue]} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="ticket-category">Category</FieldLabel>
                <Input id="ticket-category" placeholder="Hardware" {...register("category")} />
                <FieldError errors={[errors.category]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="ticket-priority">Priority</FieldLabel>
                <Select
                  value={watch("priority")}
                  onValueChange={(v) => setValue("priority", v as FormValues["priority"])}
                >
                  <SelectTrigger id="ticket-priority" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p} className="capitalize">
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={isSubmitting}>
              Create Ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
