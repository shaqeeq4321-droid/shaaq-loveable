import { Check, ImageUp, Loader2, RotateCcw, Send, Trash2 } from "lucide-react";
import { PhoneInput } from "@/components/phone-input";
import { useEffect, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from "react";

import { OptionButton } from "@/components/option-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { defaultChoices, garmentById, garments } from "@/lib/garments";
import { submitQuoteRequest, uploadCustomerLogo } from "@/lib/submissions";

export function GarmentBuilder({ initialGarment }: { initialGarment?: string }) {
  const [garmentId, setGarmentId] = useState(() => garmentById(initialGarment ?? "shirt").id);
  const garment = garmentById(garmentId);

  const [choices, setChoices] = useState<Record<string, string>>(() => defaultChoices(garment));
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [placement, setPlacement] = useState((garment.logoAreas[0] ?? { label: "Left chest", x: 50, y: 30, size: 12 }).label);
  const [position, setPosition] = useState({ x: (garment.logoAreas[0] ?? { label: "Left chest", x: 50, y: 30, size: 12 }).x, y: (garment.logoAreas[0] ?? { label: "Left chest", x: 50, y: 30, size: 12 }).y });
  const [logoSize, setLogoSize] = useState((garment.logoAreas[0] ?? { label: "Left chest", x: 50, y: 30, size: 12 }).size);
  const [side, setSide] = useState<"front" | "back">("front");
  const [dragging, setDragging] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const next = garmentById(garmentId);
    setSide("front");
    setChoices(defaultChoices(next));
    setPlacement((next.logoAreas[0] ?? { label: "Left chest", x: 50, y: 30, size: 12 }).label);
    setPosition({ x: (next.logoAreas[0] ?? { label: "Left chest", x: 50, y: 30, size: 12 }).x, y: (next.logoAreas[0] ?? { label: "Left chest", x: 50, y: 30, size: 12 }).y });
    setLogoSize((next.logoAreas[0] ?? { label: "Left chest", x: 50, y: 30, size: 12 }).size);
  }, [garmentId]);

  useEffect(() => () => { if (logoPreview) URL.revokeObjectURL(logoPreview); }, [logoPreview]);

  function pickLogo(file: File | undefined) {
    if (!file) return;
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function clearLogo() {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview(null);
  }

  function movePointer(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setPosition({ x: Math.min(96, Math.max(4, x)), y: Math.min(96, Math.max(4, y)) });
    setPlacement("Custom position");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) return;
    const data = new FormData(form);
    setSending(true);
    setError(null);
    try {
      let logoPath: string | null = null;
      if (logoFile) logoPath = await uploadCustomerLogo(logoFile);
      const quantityValue = String(data.get("quantity") ?? "").trim();
      await submitQuoteRequest({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: (String(data.get("phone") ?? "") || null),
        company: (String(data.get("company") ?? "") || null),
        garment_type: garment.name,
        specification: choices,
        quantity: quantityValue ? Number(quantityValue) : null,
        sizes: (String(data.get("sizes") ?? "") || null),
        fabric_notes: (String(data.get("fabric_notes") ?? "") || null),
        stitching_notes: (String(data.get("stitching_notes") ?? "") || null),
        logo_url: logoPath,
        logo_placement: logoFile ? `${side}: ${placement} (x ${Math.round(position.x)}%, y ${Math.round(position.y)}%, width ${Math.round(logoSize)}%)` : null,
        message: (String(data.get("message") ?? "") || null),
      });
      setSubmitted(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "We couldn't send your request just now. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center border border-border bg-background px-6 py-16 text-center sm:px-12">
        <span className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-6" /></span>
        <p className="eyebrow mt-7">Request received</p>
        <h2 className="mt-3 font-display text-4xl text-foreground">Your specification is with our team.</h2>
        <p className="mt-4 max-w-md leading-7 text-muted-foreground">We have your garment details, notes and artwork. We'll come back to you with pricing and next steps using the contact details you gave us.</p>
        <Button variant="outline" size="lg" className="mt-8" onClick={() => setSubmitted(false)}>Build another garment</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex flex-wrap gap-2">
          {garments.map((item) => (
            <OptionButton key={item.id} label={item.name} selected={item.id === garmentId} onClick={() => setGarmentId(item.id)} />
          ))}
        </div>

        <div className="mt-5 flex gap-2" role="group" aria-label="Garment view">{(["front", "back"] as const).map((view) => <OptionButton key={view} label={view === "front" ? "Front view" : "Back view"} selected={side === view} onClick={() => { setSide(view); const area = garment.logoAreas.find((item) => (item.side ?? "front") === view); if (area) { setSide(area.side ?? "front"); setPlacement(area.label); setPosition({ x: area.x, y: area.y }); setLogoSize(area.size); } }} />)}</div>
        <div
          ref={stageRef}
          onPointerMove={movePointer}
          onPointerUp={() => setDragging(false)}
          onPointerLeave={() => setDragging(false)}
          className="relative mt-6 aspect-[4/5] touch-none select-none overflow-hidden border border-border bg-secondary"
        >
          <img src={side === "back" ? garment.backImage : garment.image} alt={`${garment.name} ${side} preview`} width={1024} height={1280} className="h-full w-full object-cover" />
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Your logo positioned on the garment"
              onPointerDown={(event) => { event.preventDefault(); setDragging(true); }}
              style={{ left: `${position.x}%`, top: `${position.y}%`, width: `${logoSize}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
              draggable={false}
            />
          )}
          {!logoPreview && (
            <p className="absolute inset-x-0 bottom-0 bg-ink/70 p-4 text-center text-xs leading-5 text-cream/80">
              Upload your logo below to preview it on this garment.
            </p>
          )}
        </div>

        <div className="mt-5 border border-border bg-background p-5">
          <p className="eyebrow">Your logo</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="option-button cursor-pointer">
              <span className="inline-flex items-center gap-2"><ImageUp className="size-4" /> {logoFile ? "Replace logo" : "Upload logo"}</span>
              <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="sr-only" onChange={(event) => pickLogo(event.target.files?.[0])} />
            </label>
            {logoFile && (
              <Button type="button" variant="ghost" size="sm" onClick={clearLogo}><Trash2 className="size-4" /> Remove</Button>
            )}
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">PNG with a transparent background gives the cleanest preview. Up to 5 MB.</p>

          <p className="eyebrow mt-6">Placement</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {garment.logoAreas.map((area) => (
              <OptionButton
                key={area.label}
                label={area.label}
                selected={placement === area.label}
                onClick={() => { setSide(area.side ?? "front"); setPlacement(area.label); setPosition({ x: area.x, y: area.y }); setLogoSize(area.size); }}
              />
            ))}
          </div>
          <div className="mt-5">
            <Label htmlFor="logo-size">Logo size</Label>
            <input
              id="logo-size"
              type="range"
              min={4}
              max={45}
              value={logoSize}
              onChange={(event) => setLogoSize(Number(event.target.value))}
              className="mt-2 w-full accent-[var(--primary)]"
            />
            <p className="mt-2 text-xs text-muted-foreground">Drag the logo on the garment to fine-tune its position.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border border-border bg-background p-5 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Build your {garment.name.toLowerCase()}</p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-foreground">{garment.tagline}</h2>
            <p className="mt-2 text-sm text-muted-foreground">Suited to: {garment.audience}</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => setChoices(defaultChoices(garment))} aria-label="Reset options">
            <RotateCcw className="size-4" /> Reset
          </Button>
        </div>

        <div className="mt-8 space-y-7">
          {garment.groups.map((group) => (
            <fieldset key={group.id}>
              <legend className="text-sm font-semibold text-foreground">{group.label}</legend>
              {group.help && <p className="mt-1 text-xs leading-5 text-muted-foreground">{group.help}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                {group.options.map((option) => (
                  <OptionButton
                    key={option}
                    label={option}
                    selected={choices[group.id] === option}
                    onClick={() => setChoices((current) => ({ ...current, [group.id]: option }))}
                  />
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <p className="eyebrow">Fabric & stitching notes</p>
          <div className="mt-4 grid gap-5">
            <div className="space-y-2">
              <Label htmlFor="fabric_notes">Describe the fabric quality you need</Label>
              <Textarea id="fabric_notes" name="fabric_notes" rows={4} placeholder="Composition, weight, yarn count, handle, colour references, finish or any fabric you'd like us to match." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stitching_notes">Describe the stitching and construction you need</Label>
              <Textarea id="stitching_notes" name="stitching_notes" rows={4} placeholder="Stitch density, seam types, reinforcement, hand finishing, trims and labelling requirements." />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <p className="eyebrow">Your details</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="name">Your name <span className="text-primary">*</span></Label><Input id="name" name="name" autoComplete="name" required /></div>
            <div className="space-y-2"><Label htmlFor="company">Company / boutique</Label><Input id="company" name="company" autoComplete="organization" /></div>
            <div className="space-y-2"><Label htmlFor="email">Email address <span className="text-primary">*</span></Label><Input id="email" name="email" type="email" autoComplete="email" required /></div>
            <div className="space-y-2"><Label htmlFor="phone">Phone number</Label><PhoneInput id="phone" /></div>
            <div className="space-y-2"><Label htmlFor="quantity">Number of pieces <span className="text-primary">*</span></Label><Input id="quantity" name="quantity" type="number" min="1" placeholder="e.g. 250" required /></div>
            <div className="space-y-2"><Label htmlFor="sizes">Sizes required</Label><Input id="sizes" name="sizes" placeholder="e.g. S–XXL, or 15–18 inch collar" /></div>
            <div className="space-y-2 sm:col-span-2"><Label htmlFor="message">Anything else</Label><Textarea id="message" name="message" rows={4} placeholder="Delivery timings, packaging, sampling needs or questions." /></div>
          </div>
        </div>

        {error && <p className="mt-6 border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}

        <Button type="submit" variant="trade" size="xl" className="mt-8 w-full sm:w-auto" disabled={sending}>
          {sending ? <><Loader2 className="animate-spin" /> Sending</> : <>Send inquiry <Send /></>}
        </Button>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">We use your details only to respond to this request.</p>
      </form>
    </div>
  );
}
