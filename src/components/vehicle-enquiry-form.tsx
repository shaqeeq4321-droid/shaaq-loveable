import { useState, type FormEvent } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveVehicleEnquiry } from "@/lib/enquiries.functions";

export function VehicleEnquiryForm({ vehicleId, vehicleTitle }: { vehicleId?: string; vehicleTitle?: string }) {
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) return;
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    setSending(true); setError(null);
    try {
      await saveVehicleEnquiry({ data: { name: value("name"), email: value("email"), phone: value("phone") || null, vehicle_id: vehicleId ?? null, vehicle_title: vehicleTitle ?? null, desired_vehicle: vehicleTitle ?? value("desired_vehicle"), budget: value("budget") || null, message: value("message") } });
      setSubmitted(true);
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to send your enquiry. Please try again."); }
    finally { setSending(false); }
  }
  if (submitted) return <div className="border-t border-border py-10"><Check className="size-8 text-primary" /><h3 className="mt-4 font-display text-2xl">Enquiry received</h3><p className="mt-3 text-muted-foreground">Your vehicle requirements are saved with our team for follow-up.</p><Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>Send another enquiry</Button></div>;
  return <form onSubmit={submit} className="grid gap-5">
    <div><Label htmlFor="ve-name">Your name *</Label><Input id="ve-name" name="name" autoComplete="name" required className="mt-2" /></div>
    <div><Label htmlFor="ve-email">Email address *</Label><Input id="ve-email" name="email" type="email" autoComplete="email" required className="mt-2" /></div>
    <div><Label htmlFor="ve-phone">Phone number</Label><Input id="ve-phone" name="phone" type="tel" autoComplete="tel" className="mt-2" /></div>
    {!vehicleTitle && <div><Label htmlFor="ve-vehicle">Make / model you are looking for *</Label><Input id="ve-vehicle" name="desired_vehicle" required placeholder="e.g. Volkswagen Golf, automatic" className="mt-2" /></div>}
    <div><Label htmlFor="ve-budget">Budget (£)</Label><Input id="ve-budget" name="budget" placeholder="e.g. £10,000–£15,000" className="mt-2" /></div>
    <div><Label htmlFor="ve-message">Your requirements / questions *</Label><Textarea id="ve-message" name="message" required rows={4} className="mt-2" /></div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <Button type="submit" variant="trade" size="xl" disabled={sending}>{sending ? <><Loader2 className="animate-spin" /> Sending</> : <><Send /> Send inquiry</>}</Button>
  </form>;
}