import { Check, Send } from "lucide-react";
import { useState, type FormEvent } from "react";

import { submitQuoteRequest } from "@/lib/submissions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function QuoteForm({ initialStyle = "" }: { initialStyle?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) return;
    const d = new FormData(event.currentTarget);
    const v = (k: string) => String(d.get(k) ?? "").trim() || null;
    setSending(true); setError(null);
    try {
      await submitQuoteRequest({
        name: v("name") ?? "", email: v("email") ?? "", phone: v("phone"), company: v("company"),
        garment_type: v("garment") ?? "General", specification: { styles: v("styles") ?? "" },
        quantity: v("quantity") ? Number(v("quantity")) : null, sizes: v("sizes"),
        fabric_notes: v("fabric_notes"), stitching_notes: v("stitching_notes"),
        logo_url: null, logo_placement: null, message: v("message"),
      });
      setSubmitted(true);
    } catch (error) { setError(error instanceof Error ? error.message : "We couldn't send your request just now. Please try again."); }
    finally { setSending(false); }
  }

  if (submitted) {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center border border-border bg-background px-6 text-center sm:px-12">
        <span className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-6" /></span>
        <p className="eyebrow mt-7">Enquiry received</p>
        <h2 className="mt-3 font-display text-4xl text-foreground">Thank you for getting in touch.</h2>
        <p className="mt-4 max-w-md leading-7 text-muted-foreground">Your quote request has been received. Our team will review the details and respond using the contact information provided.</p>
        <Button variant="outline" size="lg" className="mt-8" onClick={() => setSubmitted(false)}>Send another enquiry</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-border bg-background p-5 sm:p-8 lg:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" required><Input id="name" name="name" autoComplete="name" required /></Field>
        <Field label="Company / business" htmlFor="company"><Input id="company" name="company" autoComplete="organization" /></Field>
        <Field label="Email address" htmlFor="email" required><Input id="email" name="email" type="email" autoComplete="email" required /></Field>
        <Field label="Phone number" htmlFor="phone"><Input id="phone" name="phone" type="tel" autoComplete="tel" /></Field>
        <Field label="Garment type" htmlFor="garment" required><select id="garment" name="garment" required className="flex h-10 w-full border border-input bg-card px-3 text-sm"><option>Formal shirt</option><option>T-shirt</option><option>Collared polo shirt</option><option>Trousers</option><option>Tuxedo & dinner suit</option><option>Mixed order</option></select></Field>
        <Field label="Style(s) of interest" htmlFor="styles" required><Input id="styles" name="styles" defaultValue={initialStyle} placeholder="e.g. The Mayfair, white poplin" required /></Field>
        <Field label="Fabric quality needed" htmlFor="fabric_notes" className="sm:col-span-2"><Textarea id="fabric_notes" name="fabric_notes" rows={3} placeholder="Composition, weight, weave, colour or a fabric to match." /></Field>
        <Field label="Stitching needed" htmlFor="stitching_notes" className="sm:col-span-2"><Textarea id="stitching_notes" name="stitching_notes" rows={3} placeholder="Stitch density, seam types, hand finishing, trims." /></Field>
        <Field label="Number of pieces" htmlFor="quantity" required><Input id="quantity" name="quantity" type="number" min="1" placeholder="Estimated units" required /></Field>
        <Field label="Sizes required" htmlFor="sizes"><Input id="sizes" name="sizes" placeholder="e.g. 15–18 inch collar" /></Field>
        <Field label="Message" htmlFor="message" className="sm:col-span-2"><Textarea id="message" name="message" rows={6} placeholder="Tell us about your range, delivery needs or any specific requirements." /></Field>
      </div>
      {error && <p className="mt-6 text-sm text-destructive">{error}</p>}
      <Button type="submit" variant="trade" size="xl" className="mt-8 w-full sm:w-auto" disabled={sending}>{sending ? "Sending…" : <>Send inquiry <Send /></>}</Button>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">By submitting this form, you agree that Shaaq Trading Limited may contact you about this enquiry.</p>
    </form>
  );
}

function Field({ label, htmlFor, required, className = "", children }: { label: string; htmlFor: string; required?: boolean; className?: string; children: React.ReactNode }) {
  return <div className={`space-y-2 ${className}`}><Label htmlFor={htmlFor}>{label}{required && <span className="text-primary"> *</span>}</Label>{children}</div>;
}