import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Car as CarIcon, Fuel, Gauge, Settings2 } from "lucide-react";

import { SiteShell } from "@/components/site-shell";
import { VehicleEnquiryForm } from "@/components/vehicle-enquiry-form";
import automotiveImage from "@/assets/automotive-showroom.jpg";
import { formatPrice, listCars } from "@/lib/cars";

export const Route = createFileRoute("/auto/")({
  head: () => ({
    meta: [
      { title: "Shaaq Auto | Used Cars for Sale" },
      { name: "description", content: "Browse quality cars for sale from Shaaq Auto, with full specifications and photos." },
      { property: "og:title", content: "Shaaq Auto — Cars for Sale" },
      { property: "og:description", content: "Quality vehicles with full details, photos and honest descriptions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AutoPage,
});

function AutoPage() {
  const { data: cars, isLoading, error } = useQuery({ queryKey: ["cars"], queryFn: listCars });
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-ink"><img src={automotiveImage} alt="Volkswagen, BMW and Ford vehicles outside a London showroom" width={1536} height={1024} className="aspect-[3/2] max-h-[650px] w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" /><div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-10 sm:px-8 lg:px-12"><p className="eyebrow text-cream/70">Cars for sale · London</p><h1 className="mt-4 font-display text-4xl text-cream sm:text-6xl">Shaaq Automotives</h1><p className="mt-4 max-w-xl text-sm leading-6 text-cream/80">Browse available vehicles or tell us the car you are looking for.</p></div></section>
      <section className="section-pad bg-background">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          {isLoading && <p className="text-muted-foreground">Loading cars…</p>}
          {error && <p className="text-destructive">Couldn’t load cars right now. Please try again shortly.</p>}
          {cars && cars.length === 0 && (
            <div className="border border-border bg-secondary p-10 text-center">
              <CarIcon className="mx-auto size-8 text-primary" />
              <p className="mt-4 font-display text-2xl">New stock arriving soon.</p>
              <p className="mt-2 text-muted-foreground">Check back shortly or contact us about what you’re looking for.</p>
            </div>
          )}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cars?.map((car) => (
              <Link key={car.id} to="/auto/$id" params={{ id: car.id }} className="group block border border-border bg-card transition-shadow hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  {car.photos[0] ? (
                    <img src={car.photos[0]} alt={car.title} loading="lazy" width={800} height={600} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="grid size-full place-items-center text-muted-foreground"><CarIcon className="size-10" /></div>
                  )}
                  {car.status !== "available" && (
                    <span className="absolute left-3 top-3 bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground">{car.status}</span>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{[car.year, car.make].filter(Boolean).join(" · ")}</p>
                  <h2 className="mt-2 font-display text-2xl leading-tight">{car.title}</h2>
                  <p className="mt-3 text-xl font-semibold text-primary">{formatPrice(car.price)}</p>
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4 text-sm text-muted-foreground [&_svg]:size-4 [&_svg]:text-primary">
                    {car.mileage != null && <span className="inline-flex items-center gap-1.5"><Gauge />{car.mileage.toLocaleString("en-GB")} mi</span>}
                    {car.fuel && <span className="inline-flex items-center gap-1.5"><Fuel />{car.fuel}</span>}
                    {car.transmission && <span className="inline-flex items-center gap-1.5"><Settings2 />{car.transmission}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad bg-secondary"><div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-12"><div><p className="eyebrow">Vehicle enquiries</p><h2 className="section-title mt-5">Looking for a particular car?</h2><p className="mt-6 max-w-md leading-8 text-muted-foreground">Share your preferred make, model, budget and requirements. Our team will follow up using the details you provide.</p></div><VehicleEnquiryForm /></div></section>
    </SiteShell>
  );
}
