import { useState } from "react";
import { cn } from "@/lib/utils";

// [country name, dial code]
const COUNTRIES: ReadonlyArray<readonly [string, string]> = [
  ["United Kingdom", "+44"], ["Sri Lanka", "+94"], ["India", "+91"], ["Pakistan", "+92"], ["Bangladesh", "+880"],
  ["United States / Canada", "+1"], ["Ireland", "+353"], ["United Arab Emirates", "+971"], ["Saudi Arabia", "+966"],
  ["Qatar", "+974"], ["Kuwait", "+965"], ["Bahrain", "+973"], ["Oman", "+968"], ["Maldives", "+960"], ["Nepal", "+977"],
  ["Australia", "+61"], ["New Zealand", "+64"], ["Singapore", "+65"], ["Malaysia", "+60"], ["Hong Kong", "+852"],
  ["China", "+86"], ["Japan", "+81"], ["South Korea", "+82"], ["Thailand", "+66"], ["Indonesia", "+62"],
  ["Philippines", "+63"], ["Vietnam", "+84"], ["France", "+33"], ["Germany", "+49"], ["Italy", "+39"], ["Spain", "+34"],
  ["Portugal", "+351"], ["Netherlands", "+31"], ["Belgium", "+32"], ["Switzerland", "+41"], ["Austria", "+43"],
  ["Sweden", "+46"], ["Norway", "+47"], ["Denmark", "+45"], ["Finland", "+358"], ["Poland", "+48"], ["Romania", "+40"],
  ["Greece", "+30"], ["Turkey", "+90"], ["Russia", "+7"], ["Ukraine", "+380"], ["Egypt", "+20"], ["South Africa", "+27"],
  ["Nigeria", "+234"], ["Kenya", "+254"], ["Ghana", "+233"], ["Mauritius", "+230"], ["Brazil", "+55"], ["Mexico", "+52"],
  ["Argentina", "+54"], ["Israel", "+972"], ["Jordan", "+962"], ["Lebanon", "+961"], ["Iraq", "+964"],
];

/**
 * Country-code picker + phone number. Renders a hidden input named `name`
 * holding the combined value (e.g. "+94 771234567"), so existing forms that
 * read FormData keep working unchanged. Empty number => empty value.
 */
export function PhoneInput({ id, name = "phone", className }: { id: string; name?: string; className?: string }) {
  const [code, setCode] = useState("+44");
  const [number, setNumber] = useState("");
  const cleaned = number.replace(/^0+/, "").trim();
  const combined = cleaned ? `${code} ${cleaned}` : "";
  const field =
    "h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm";
  return (
    <div className={cn("flex gap-2", className)}>
      <select
        aria-label="Country code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className={cn(field, "w-[7.5rem] shrink-0 bg-background")}
      >
        {COUNTRIES.map(([country, dial]) => (
          <option key={country} value={dial}>{`${dial} ${country}`}</option>
        ))}
      </select>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="Phone number"
        value={number}
        onChange={(e) => setNumber(e.target.value.replace(/[^\d\s()-]/g, ""))}
        className={cn(field, "min-w-0 flex-1 w-full")}
      />
      <input type="hidden" name={name} value={combined} />
    </div>
  );
}
