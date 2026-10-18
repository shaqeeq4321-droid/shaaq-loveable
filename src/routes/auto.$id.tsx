import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Car as CarIcon, Check } from "lucide-react";
import { useState } from "react";

import { SiteShell } from "@/components/site-shell";
import { VehicleEnquiryForm } from "@/components/vehicle-enquiry-form";
import { formatPrice, getCar } from "@/lib/cars";

export const Route = createFileRoute("/auto/$id")({
  head: () => ({
    meta: [
      { title: "Car details | Shaaq Auto" },
      { name: "description", content: "Full specification, photos and description of this vehicle from Shaaq Auto." },
      { property: "og:title", content: "Car for sale | Shaaq Auto" },
      { property: "og:description", content: "See the full details and photos of this car." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CarDetail,
});

function CarDetail() {
  const { id } = Route.useParams();
  const { data: car, isLoading } = useQuery({ queryKey: ["car", id], queryFn: () => getCar(id) });
  const [active, setActive] = useState(0);

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <Link to="/auto" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> All cars</Link>
        {isLoading && <p className="mt-10 text-muted-foreground">Loading…</p>}
        {!isLoading && !car && <p className="mt-10 font-display text-2xl">This car is no longer listed.</p>}
        {car && (
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                {car.photos[active] ? <img src={car.photos[active]} alt={car.title} width={1200} height={900} className="size-full object-cover" /> : <div className="grid size-full place-items-center text-muted-foreground"><CarIcon className="size-12" /></div>}
              </div>
              {car.photos.length > 1 && (
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {car.photos.map((p, i) => (
                    <button key={p} type="button" onClick={() => setActive(i)} className={`aspect-[4/3] overflow-hidden border-2 ${i === active ? "border-primary" : "border-transparent"}`} aria-label={`Show photo ${i + 1}`}>
                      <img src={p} alt="" loading="lazy" width={200} height={150} className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              {car.description && (
                <div className="mt-10">
                  <p className="eyebrow">Description</p>
                  <p className="mt-4 whitespace-pre-line leading-8 text-foreground/85">{car.description}</p>
                </div>
              )}
            </div>
            <aside>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{car.status}</p>
              <h1 className="mt-2 font-display text-4xl leading-tight">{car.title}</h1>
              <p className="mt-4 text-3xl font-semibold text-primary">{formatPrice(car.price)}</p>
              <dl className="mt-8 border-t border-border">
                {([
                  ["Make", car.make], ["Model", car.model], ["Year", car.year], ["Mileage", car.mileage != null ? `${car.mileage.toLocaleString("en-GB")} miles` : null],
                  ["Fuel", car.fuel], ["Transmission", car.transmission], ["Body type", car.body_type], ["Engine", car.engine], ["Colour", car.colour], ["Doors", car.doors],
                ] as const).filter(([, v]) => v != null && v !== "").map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-border py-3 text-sm"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
                ))}
              </dl>
              {car.features.length > 0 && (
                <div className="mt-8">
                  <p className="eyebrow">Features</p>
                  <ul className="mt-4 grid gap-2 text-sm">{car.features.map((f) => <li key={f} className="flex items-center gap-2"><Check className="size-4 text-primary" />{f}</li>)}</ul>
                </div>
              )}
              <div className="mt-10 border-t border-border pt-8"><h2 className="mb-6 font-display text-2xl">Enquire about this car</h2><VehicleEnquiryForm vehicleId={car.id} vehicleTitle={car.title} /></div>
            </aside>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
