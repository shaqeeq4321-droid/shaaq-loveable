import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { claimAdmin, deleteCar, formatPrice, getRawCar, listCars, saveCar, uploadCarPhoto, type CarInput } from "@/lib/cars";

export const Route = createFileRoute("/auto/manage")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Post a car | Shaaq Automotives" },
      { name: "description", content: "Owner area for posting and managing Shaaq Automotives car listings." },
      { property: "og:title", content: "Post a car | Shaaq Automotives" },
      { property: "og:description", content: "Owner area for managing car listings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ManagePage,
});

function ManagePage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    claimAdmin().then(setIsAdmin).catch(() => setIsAdmin(false));
  }, [session?.user.id]);

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
        <p className="eyebrow">Shaaq Automotives · Owner area</p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">Post and manage cars</h1>
        {session === undefined && <p className="mt-8 text-muted-foreground">Loading…</p>}
        {session === null && <SignIn />}
        {session && isAdmin === null && <p className="mt-8 text-muted-foreground">Checking access…</p>}
        {session && isAdmin === false && (
          <div className="mt-8 border border-border bg-secondary p-6">
            <p>This account doesn’t have permission to post cars.</p>
            <Button variant="outline" className="mt-4" onClick={() => supabase.auth.signOut()}>Sign out</Button>
          </div>
        )}
        {session && isAdmin && <Manager />}
      </div>
    </SiteShell>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const { error } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auto/manage` } });
    setBusy(false);
    if (error) setMsg(error.message);
    else if (mode === "up") setMsg("Check your email to confirm your account, then sign in.");
  }

  return (
    <form onSubmit={submit} className="mt-8 max-w-md space-y-4 border border-border bg-card p-6">
      <p className="text-sm text-muted-foreground">Sign in to post cars. The first account to sign in becomes the owner.</p>
      <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {msg && <p className="text-sm text-primary">{msg}</p>}
      <Button type="submit" variant="trade" className="w-full" disabled={busy}>{mode === "in" ? "Sign in" : "Create account"}</Button>
      <button type="button" className="text-sm underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>{mode === "in" ? "Create an account" : "I already have an account"}</button>
    </form>
  );
}

const empty: CarInput = { title: "", make: "", model: "", year: null, price: null, mileage: null, fuel: "Petrol", transmission: "Manual", body_type: "", colour: "", engine: "", doors: null, description: "", features: [], photos: [], status: "available", published: true };

function Manager() {
  const qc = useQueryClient();
  const { data: enquiries } = useQuery({ queryKey: ["vehicle-enquiries", "manage"], queryFn: async () => { const { data, error } = await supabase.from("vehicle_enquiries").select("*").order("created_at", { ascending: false }); if (error) throw error; return data; } });
  const { data: cars } = useQuery({ queryKey: ["cars", "manage"], queryFn: listCars });
  const [form, setForm] = useState<CarInput>(empty);
  const [editId, setEditId] = useState<string | undefined>();
  const [files, setFiles] = useState<File[]>([]);
  const [featuresText, setFeaturesText] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const set = <K extends keyof CarInput>(k: K, v: CarInput[K]) => setForm((f) => ({ ...f, [k]: v }));
  const num = (v: string) => (v === "" ? null : Number(v));

  async function startEdit(id: string) {
    const car = await getRawCar(id);
    if (!car) return;
    const { id: _i, created_at: _c, ...rest } = car;
    setForm(rest); setFeaturesText(rest.features.join("\n")); setEditId(id); setFiles([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      const uploaded = await Promise.all(files.map(uploadCarPhoto));
      await saveCar({ ...form, features: featuresText.split("\n").map((s) => s.trim()).filter(Boolean), photos: [...form.photos, ...uploaded] }, editId);
      setMsg(editId ? "Car updated." : "Car posted.");
      setForm(empty); setFeaturesText(""); setFiles([]); setEditId(undefined);
      qc.invalidateQueries({ queryKey: ["cars"] });
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  async function remove(id: string) {
    if (!confirm("Remove this car?")) return;
    await deleteCar(id);
    qc.invalidateQueries({ queryKey: ["cars"] });
  }

  const field = "space-y-1.5 text-sm font-medium";
  return (
    <div className="mt-8 space-y-12">
      <form onSubmit={submit} className="space-y-6 border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl">{editId ? "Edit car" : "Post a new car"}</h2>
          <Button type="button" variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </div>
        <label className={`${field} block`}>Listing title *<Input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="2019 BMW 320d M Sport" /></label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className={field}>Make *<Input required value={form.make} onChange={(e) => set("make", e.target.value)} /></label>
          <label className={field}>Model *<Input required value={form.model} onChange={(e) => set("model", e.target.value)} /></label>
          <label className={field}>Year<Input type="number" value={form.year ?? ""} onChange={(e) => set("year", num(e.target.value))} /></label>
          <label className={field}>Price (£)<Input type="number" value={form.price ?? ""} onChange={(e) => set("price", num(e.target.value))} /></label>
          <label className={field}>Mileage<Input type="number" value={form.mileage ?? ""} onChange={(e) => set("mileage", num(e.target.value))} /></label>
          <label className={field}>Fuel<Select value={form.fuel ?? ""} onChange={(v) => set("fuel", v)} options={["Petrol", "Diesel", "Hybrid", "Electric"]} /></label>
          <label className={field}>Transmission<Select value={form.transmission ?? ""} onChange={(v) => set("transmission", v)} options={["Manual", "Automatic"]} /></label>
          <label className={field}>Body type<Input value={form.body_type ?? ""} onChange={(e) => set("body_type", e.target.value)} placeholder="Saloon, SUV…" /></label>
          <label className={field}>Engine<Input value={form.engine ?? ""} onChange={(e) => set("engine", e.target.value)} placeholder="2.0L" /></label>
          <label className={field}>Colour<Input value={form.colour ?? ""} onChange={(e) => set("colour", e.target.value)} /></label>
          <label className={field}>Doors<Input type="number" value={form.doors ?? ""} onChange={(e) => set("doors", num(e.target.value))} /></label>
          <label className={field}>Status<Select value={form.status} onChange={(v) => set("status", v)} options={["available", "reserved", "sold"]} /></label>
        </div>
        <label className={`${field} block`}>Description<Textarea rows={6} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="Condition, service history, owners, MOT…" /></label>
        <label className={`${field} block`}>Features (one per line)<Textarea rows={4} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder={"Sat nav\nHeated seats\nParking sensors"} /></label>
        <div className={field}>
          Photos
          <Input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
          {form.photos.length > 0 && (
            <p className="text-xs text-muted-foreground">{form.photos.length} existing photo(s). <button type="button" className="underline" onClick={() => set("photos", [])}>Remove existing</button></p>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} /> Show on website</label>
        {msg && <p className="text-sm text-primary">{msg}</p>}
        <div className="flex gap-3">
          <Button type="submit" variant="trade" size="lg" disabled={busy}>{busy && <Loader2 className="animate-spin" />}{editId ? "Save changes" : "Post car"}</Button>
          {editId && <Button type="button" variant="outline" size="lg" onClick={() => { setEditId(undefined); setForm(empty); setFeaturesText(""); }}>Cancel</Button>}
        </div>
      </form>

      <div>
        <h2 className="font-display text-2xl">Vehicle enquiries</h2>
        <div className="mt-4 divide-y divide-border border-y border-border">{enquiries?.length === 0 && <p className="py-5 text-sm text-muted-foreground">No enquiries received yet.</p>}{enquiries?.map((entry) => <article key={entry.id} className="py-5"><h3 className="font-semibold">{entry.desired_vehicle}</h3><p className="mt-2 text-sm">{entry.name} · <a href={`mailto:${entry.email}`} className="text-primary underline">{entry.email}</a>{entry.phone ? ` · ${entry.phone}` : ""}</p><p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{entry.message}</p>{entry.budget && <p className="mt-2 text-sm">Budget: {entry.budget}</p>}</article>)}</div>
      </div>
      <div>
        <h2 className="font-display text-2xl">Your listings</h2>
        <div className="mt-4 divide-y divide-border border border-border">
          {cars?.length === 0 && <p className="p-5 text-sm text-muted-foreground">No cars posted yet.</p>}
          {cars?.map((c) => (
            <div key={c.id} className="flex items-center gap-4 p-4">
              <div className="h-14 w-20 shrink-0 overflow-hidden bg-secondary">{c.photos[0] && <img src={c.photos[0]} alt="" width={80} height={56} className="size-full object-cover" />}</div>
              <div className="min-w-0 flex-1">
                <Link to="/auto/$id" params={{ id: c.id }} className="block truncate font-medium hover:underline">{c.title}</Link>
                <p className="text-sm text-muted-foreground">{formatPrice(c.price)} · {c.status}{c.published ? "" : " · hidden"}</p>
              </div>
              <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => startEdit(c.id)}><Pencil /></Button>
              <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => remove(c.id)}><Trash2 /></Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="flex h-10 w-full border border-input bg-background px-3 text-sm capitalize">
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
