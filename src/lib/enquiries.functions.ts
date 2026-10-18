import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contact = {
  name: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(254),
  phone: z.string().max(80).nullable(),
  company: z.string().max(200).nullable(),
};
const notes = z.string().max(12000).nullable();

export const saveQuote = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    ...contact,
    garment_type: z.string().min(1).max(120),
    specification: z.record(z.string().max(80), z.string().max(1000)),
    quantity: z.number().int().min(1).max(1000000).nullable(),
    sizes: notes, fabric_notes: notes, stitching_notes: notes,
    logo_url: z.string().max(500).nullable(), logo_placement: z.string().max(500).nullable(), message: notes,
  }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count, error: limitError } = await supabaseAdmin.from("quote_requests").select("id", { count: "exact", head: true }).eq("email", data.email).gte("created_at", since);
    if (limitError) throw new Error("Unable to check your enquiry. Please try again.");
    if ((count ?? 0) >= 5) throw new Error("Please wait a few minutes before sending another enquiry.");
    const { error } = await supabaseAdmin.from("quote_requests").insert(data);
    if (error) throw new Error("Unable to save your enquiry. Please try again.");
    return { saved: true, notification: "not_configured" as const };
  });

export const saveAppointment = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    ...contact, preferred_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    preferred_time: z.enum(["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]),
    visit_address: z.string().trim().min(5).max(1500),
    interests: z.array(z.string().max(100)).max(20), notes,
  }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count, error: limitError } = await supabaseAdmin.from("appointments").select("id", { count: "exact", head: true }).eq("email", data.email).gte("created_at", since);
    if (limitError) throw new Error("Unable to check your appointment. Please try again.");
    if ((count ?? 0) >= 5) throw new Error("Please wait a few minutes before requesting another visit.");
    const { error } = await supabaseAdmin.from("appointments").insert(data);
    if (error) throw new Error("Unable to save your appointment. Please try again.");
    return { saved: true, notification: "not_configured" as const };
  });

export const saveVehicleEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    name: contact.name, email: contact.email, phone: contact.phone,
    vehicle_id: z.string().uuid().nullable(), vehicle_title: z.string().max(300).nullable(),
    desired_vehicle: z.string().trim().min(1).max(500), budget: z.string().max(100).nullable(),
    message: z.string().trim().min(1).max(12000),
  }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count, error: limitError } = await supabaseAdmin.from("vehicle_enquiries").select("id", { count: "exact", head: true }).eq("email", data.email).gte("created_at", since);
    if (limitError) throw new Error("Unable to check your enquiry. Please try again.");
    if ((count ?? 0) >= 5) throw new Error("Please wait a few minutes before sending another enquiry.");
    if (data.vehicle_id) {
      const { data: car } = await supabaseAdmin.from("cars").select("title").eq("id", data.vehicle_id).eq("published", true).maybeSingle();
      if (!car) throw new Error("This vehicle is no longer available to enquire about.");
      data.vehicle_title = car.title;
    }
    const { error } = await supabaseAdmin.from("vehicle_enquiries").insert(data);
    if (error) throw new Error("Unable to save your enquiry. Please try again.");
    return { saved: true, notification: "not_configured" as const };
  });