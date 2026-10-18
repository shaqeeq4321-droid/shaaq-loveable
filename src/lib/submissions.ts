import { supabase } from "@/integrations/supabase/client";
import { saveAppointment, saveQuote } from "@/lib/enquiries.functions";

export async function uploadCustomerLogo(file: File) {
  if (file.size > 5 * 1024 * 1024) throw new Error("Your logo must be smaller than 5 MB.");
  if (!["image/png", "image/jpeg", "image/webp", "image/svg+xml"].includes(file.type)) throw new Error("Please upload a PNG, JPEG, WebP or SVG logo.");
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "png";
  const path = `${crypto.randomUUID()}.${extension ?? "png"}`;
  const { error } = await supabase.storage
    .from("customer-logos")
    .upload(path, file, { contentType: file.type || "image/png" });
  if (error) throw error;
  return path;
}

export type QuoteSubmission = {
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  garment_type: string;
  specification: Record<string, string>;
  quantity: number | null;
  sizes: string | null;
  fabric_notes: string | null;
  stitching_notes: string | null;
  logo_url: string | null;
  logo_placement: string | null;
  message: string | null;
};

export async function submitQuoteRequest(submission: QuoteSubmission) {
  return saveQuote({ data: submission });
}

export type AppointmentSubmission = {
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  preferred_date: string;
  preferred_time: string;
  visit_address: string;
  interests: string[];
  notes: string | null;
};

export async function submitAppointment(submission: AppointmentSubmission) {
  return saveAppointment({ data: submission });
}
