import type { SupabaseClient } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

// Untyped handle: the cars table is newer than the generated types.
const db = supabase as unknown as SupabaseClient;

export type Car = {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number | null;
  price: number | null;
  mileage: number | null;
  fuel: string | null;
  transmission: string | null;
  body_type: string | null;
  colour: string | null;
  engine: string | null;
  doors: number | null;
  description: string | null;
  features: string[];
  photos: string[];
  status: string;
  published: boolean;
  created_at: string;
};

export type CarInput = Omit<Car, "id" | "created_at">;

async function withPhotoUrls(cars: Car[]) {
  const paths = [...new Set(cars.flatMap((c) => c.photos))];
  if (!paths.length) return cars;
  const { data } = await db.storage.from("car-photos").createSignedUrls(paths, 60 * 60 * 6);
  const map = new Map((data ?? []).map((d) => [d.path, d.signedUrl]));
  return cars.map((c) => ({ ...c, photos: c.photos.map((p) => map.get(p) ?? "").filter(Boolean) }));
}

export async function listCars() {
  const { data, error } = await db.from("cars").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return withPhotoUrls((data ?? []) as Car[]);
}

export async function getCar(id: string) {
  const { data, error } = await db.from("cars").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return (await withPhotoUrls([data as Car]))[0];
}

export async function getRawCar(id: string) {
  const { data, error } = await db.from("cars").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Car | null;
}

export async function uploadCarPhoto(file: File) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await db.storage.from("car-photos").upload(path, file, { contentType: file.type });
  if (error) throw error;
  return path;
}

export async function saveCar(input: CarInput, id?: string) {
  const q = id ? db.from("cars").update(input).eq("id", id) : db.from("cars").insert(input);
  const { error } = await q;
  if (error) throw error;
}

export async function deleteCar(id: string) {
  const { error } = await db.from("cars").delete().eq("id", id);
  if (error) throw error;
}

export async function claimAdmin() {
  const { data, error } = await db.rpc("claim_first_admin");
  if (error) throw error;
  return Boolean(data);
}

export const formatPrice = (n: number | null) =>
  n == null ? "Price on request" : new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
