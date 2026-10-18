import type { ReactNode } from "react";

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="page-intro">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <p className="eyebrow text-cream/70">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[1.02] text-cream sm:text-6xl lg:text-7xl">{title}</h1>
        <div className="mt-7 max-w-2xl text-base leading-8 text-cream/70 sm:text-lg">{children}</div>
      </div>
    </section>
  );
}