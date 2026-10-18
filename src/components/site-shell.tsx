import { Link, useRouterState } from "@tanstack/react-router";
import { Facebook, Instagram, Menu, MessageCircle, Phone, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";

const navigation = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Customise", to: "/customise" },
  { label: "Collection", to: "/collection" },
  { label: "Appointments", to: "/appointments" },
  { label: "Contact", to: "/contact" },
] as const;

const autoNavigation = [
  { label: "Cars for sale", to: "/auto" },
  { label: "Contact", to: "/contact" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isAuto = pathname.startsWith("/auto");
  const nav = isAuto ? autoNavigation : navigation;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-ink text-cream">
        <div className="mx-auto flex max-w-7xl px-5 text-xs font-semibold uppercase tracking-[0.16em] sm:px-8 lg:px-12">
          <Link to="/" className={`px-4 py-2.5 ${!isAuto ? "bg-primary text-primary-foreground" : "text-cream/70 hover:text-cream"}`}>Apparels</Link>
          <Link to="/auto" className={`px-4 py-2.5 ${isAuto ? "bg-primary text-primary-foreground" : "text-cream/70 hover:text-cream"}`}>Automotives</Link>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto grid h-[76px] max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:px-8 lg:px-12">
          <BrandMark to={isAuto ? "/auto" : "/"} sub={isAuto ? "Automotives" : "Apparels"} />
          <div className="hidden items-center gap-6 lg:flex">
            <nav className="flex items-center gap-5" aria-label="Main navigation">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`nav-link ${pathname === item.to ? "nav-link-active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Button asChild variant="trade" size="lg">
              {isAuto ? <Link to="/auto/manage">Post a car</Link> : <Link to="/enquiry">Request a quote</Link>}
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
        {open && (
          <div className="border-t border-border bg-background px-5 py-5 lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col" aria-label="Mobile navigation">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="border-b border-border py-3 font-medium text-foreground"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild variant="trade" size="lg" className="mt-5 w-full">
                {isAuto ? <Link to="/auto/manage" onClick={() => setOpen(false)}>Post a car</Link> : <Link to="/enquiry" onClick={() => setOpen(false)}>Request a quote</Link>}
              </Button>
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-18">
          <div className="grid gap-12 border-b border-cream/15 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <BrandMark className="footer-brand" />
              <p className="mt-5 max-w-sm text-sm leading-7 text-cream/65">
                Custom shirts, t-shirts, trousers and tuxedos, made to your specification and branded with your logo.
              </p>
            </div>
            <div>
              <p className="footer-heading">Quick links</p>
              <div className="mt-5 grid gap-3 text-sm text-cream/70">
                {navigation.slice(1).map((item) => <Link key={item.to} to={item.to} className="w-fit hover:text-cream">{item.label}</Link>)}
                <Link to="/enquiry" className="w-fit hover:text-cream">Request a quote</Link>
                <Link to="/auto" className="w-fit hover:text-cream">Automotives — cars for sale</Link>
              </div>
            </div>
            <div>
              <p className="footer-heading">Get in touch</p>
              <a href="mailto:info@shaaqtrading.com" className="mt-5 block text-sm text-cream/70 hover:text-cream">info@shaaqtrading.com</a>
              <a href="https://wa.me/447440744464" target="_blank" rel="noreferrer" className="mt-3 block text-sm text-cream/70 hover:text-cream">WhatsApp: +44 7440 744464</a>
              <a href="tel:+447440744464" className="mt-3 flex items-center gap-2 text-sm text-cream/70 hover:text-cream"><Phone className="size-4" /> +44 7440 744464</a>
              <p className="mt-3 text-sm text-cream/70">London, United Kingdom</p>
              <div className="mt-6 flex gap-2">
                <a className="social-button" href="https://wa.me/447440744464" target="_blank" rel="noreferrer" aria-label="Chat with Shaaq Trading on WhatsApp"><MessageCircle /></a>
                <a className="social-button" href="https://www.facebook.com/shaaqtrading/" target="_blank" rel="noreferrer" aria-label="Shaaq Trading on Facebook"><Facebook /></a>
                <a className="social-button" href="https://www.instagram.com/shaaqtrading/" target="_blank" rel="noreferrer" aria-label="Shaaq Trading on Instagram"><Instagram /></a>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-7 text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Shaaq Trading Limited · Company number 15821646.</p>
            <p>Trading as Shaaq Apparels &amp; Automotives.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}