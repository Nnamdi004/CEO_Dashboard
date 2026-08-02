"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Boxes } from "lucide-react";
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

const CONDITIONS = ["excellent", "good", "fair", "poor"] as const;
const STATUSES = [
  { value: "in_use", label: "In Use" },
  { value: "in_storage", label: "In Storage" },
  { value: "under_repair", label: "Under Repair" },
  { value: "retired", label: "Retired" },
] as const;

const schema = z.object({
  name: z.string().min(2, "Asset name is required"),
  category: z.string().min(2, "Category is required"),
  serialNumber: z.string().min(2, "Serial number is required"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  currentValue: z.number().positive("Value must be greater than 0"),
  condition: z.enum(CONDITIONS),
  location: z.string().min(2, "Location is required"),
  status: z.enum(["in_use", "in_storage", "under_repair", "retired"]),
  warrantyExpiry: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function RegisterAssetDialog() {
  const [open, setOpen] = useState(false);
  const addAsset = useWorkspaceStore((s) => s.addAsset);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { condition: "excellent", status: "in_use" },
  });

  function onSubmit(values: FormValues) {
    addAsset({
      name: values.name,
      category: values.category,
      serialNumber: values.serialNumber,
      assignedTo: null,
      purchaseDate: values.purchaseDate,
      currentValue: values.currentValue,
      condition: values.condition,
      location: values.location,
      status: values.status,
      warrantyExpiry: values.warrantyExpiry || null,
    });
    toast.success(`Asset "${values.name}" registered.`);
    reset({ condition: "excellent", status: "in_use" });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="justify-start gap-2" />}>
        <Boxes className="size-4 text-muted-foreground" />
        Register Asset
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register Asset</DialogTitle>
          <DialogDescription>Add a new company asset to the register.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="asset-name">Asset name</FieldLabel>
                <Input id="asset-name" placeholder="Dell Latitude 5440" {...register("name")} />
                <FieldError errors={[errors.name]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="asset-category">Category</FieldLabel>
                <Input id="asset-category" placeholder="Computers" {...register("category")} />
                <FieldError errors={[errors.category]} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="asset-serial">Serial number</FieldLabel>
                <Input id="asset-serial" placeholder="SN-00123" {...register("serialNumber")} />
                <FieldError errors={[errors.serialNumber]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="asset-value">Current value (₦)</FieldLabel>
                <Input id="asset-value" type="number" step="1" placeholder="480000" {...register("currentValue", { valueAsNumber: true })} />
                <FieldError errors={[errors.currentValue]} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="asset-condition">Condition</FieldLabel>
                <Select
                  value={watch("condition")}
                  onValueChange={(v) => setValue("condition", v as FormValues["condition"])}
                >
                  <SelectTrigger id="asset-condition" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITIONS.map((c) => (
                      <SelectItem key={c} value={c} className="capitalize">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="asset-status">Status</FieldLabel>
                <Select
                  value={watch("status")}
                  onValueChange={(v) => setValue("status", v as FormValues["status"])}
                >
                  <SelectTrigger id="asset-status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="asset-location">Location</FieldLabel>
                <Input id="asset-location" placeholder="Lagos HQ" {...register("location")} />
                <FieldError errors={[errors.location]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="asset-purchase">Purchase date</FieldLabel>
                <Input id="asset-purchase" type="date" {...register("purchaseDate")} />
                <FieldError errors={[errors.purchaseDate]} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="asset-warranty">Warranty expiry (optional)</FieldLabel>
              <Input id="asset-warranty" type="date" {...register("warrantyExpiry")} />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={isSubmitting}>
              Register Asset
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
