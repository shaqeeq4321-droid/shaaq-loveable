import { CalendarCheck, Check, Loader2 } from "lucide-react";
import { PhoneInput } from "@/components/phone-input";
import { useState, type FormEvent } from "react";

import { OptionButton } from "@/components/option-button";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitAppointment } from "@/lib/submissions";

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

const interestOptions = [
  "Fabric samples",
  "Stitching & finishing",
  "Shirt specification",
  "T-shirt specification",
  "Trouser specification",
  "Tuxedo & dinner suit",
  "Logo & branding",
  "Sizing and fit",
];

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function AppointmentForm() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>(["Fabric samples"]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function toggleInterest(value: string) {
    setInterests((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) return;
    if (!date || !time) {
      setError("Please choose a date and a time for your visit.");
      return;
    }
    const data = new FormData(form);
    setSending(true);
    setError(null);
    try {
      await submitAppointment({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? "") || null,
        company: String(data.get("company") ?? "") || null,
        preferred_date: formatDate(date),
        preferred_time: time,
        visit_address: String(data.get("visit_address") ?? ""),
        interests,
        notes: String(data.get("notes") ?? "") || null,
      });
      setSubmitted(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "We couldn't book that just now. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center border border-border bg-background px-6 py-16 text-center sm:px-12">
        <span className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-6" /></span>
        <p className="eyebrow mt-7">Appointment requested</p>
        <h2 className="mt-3 font-display text-4xl text-foreground">
          {date ? date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) : "Your visit"} at {time}
        </h2>
        <p className="mt-4 max-w-md leading-7 text-muted-foreground">We'll confirm the visit by email and arrange to bring the selected samples to your address.</p>
        <Button variant="outline" size="lg" className="mt-8" onClick={() => { setSubmitted(false); setDate(undefined); setTime(null); }}>Request another visit</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 border border-border bg-background p-5 sm:p-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-12 lg:p-10">
      <div>
        <p className="eyebrow">Choose a date</p>
        <div className="mt-4 border border-border p-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={{ before: new Date() }}
            className="w-fit"
          />
        </div>
        <p className="eyebrow mt-7">Choose a time</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {timeSlots.map((slot) => (
            <OptionButton key={slot} label={slot} selected={time === slot} onClick={() => setTime(slot)} />
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow">What would you like to see?</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {interestOptions.map((option) => (
            <OptionButton key={option} label={option} selected={interests.includes(option)} onClick={() => toggleInterest(option)} />
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="ap-name">Your name <span className="text-primary">*</span></Label><Input id="ap-name" name="name" autoComplete="name" required /></div>
          <div className="space-y-2"><Label htmlFor="ap-company">Company / boutique</Label><Input id="ap-company" name="company" autoComplete="organization" /></div>
          <div className="space-y-2"><Label htmlFor="ap-email">Email address <span className="text-primary">*</span></Label><Input id="ap-email" name="email" type="email" autoComplete="email" required /></div>
          <div className="space-y-2"><Label htmlFor="ap-phone">Phone number</Label><PhoneInput id="ap-phone" /></div>
          <div className="space-y-2 sm:col-span-2"><Label htmlFor="ap-address">Address for our visit <span className="text-primary">*</span></Label><Textarea id="ap-address" name="visit_address" rows={3} autoComplete="street-address" required placeholder="Business name, building and street, town or city, postcode" /></div>
          <div className="space-y-2 sm:col-span-2"><Label htmlFor="ap-notes">Notes</Label><Textarea id="ap-notes" name="notes" rows={4} placeholder="Tell us what you'd like to review, or anything we should prepare in advance." /></div>
        </div>

        <div className="mt-6 border border-border bg-secondary p-4 text-sm leading-6 text-muted-foreground">
          {date && time
            ? <>You're requesting an on-site visit on <strong className="text-foreground">{date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</strong> at <strong className="text-foreground">{time}</strong>.</>
            : "Select a preferred date and time for us to visit you."}
        </div>

        {error && <p className="mt-5 border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}

        <Button type="submit" variant="trade" size="xl" className="mt-6 w-full sm:w-auto" disabled={sending}>
          {sending ? <><Loader2 className="animate-spin" /> Requesting</> : <>Request an on-site visit <CalendarCheck /></>}
        </Button>
      </div>
    </form>
  );
}
