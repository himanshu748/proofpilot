import { Link, useLocation } from "wouter";
import { BookOpenText, FileCheck2, Globe2, LayoutDashboard, Menu, ShieldCheck, Sparkles, X } from "lucide-react";
import { useState, type ReactNode } from "react";

const navigation = [
  { href: "/", label: "Workspace", icon: LayoutDashboard },
  { href: "/review/sample-invoice", label: "Review queue", icon: FileCheck2 },
  { href: "/demo/sample-invoice", label: "Public demo", icon: ShieldCheck },
  { href: "/submission", label: "Submission", icon: BookOpenText },
];

export function StatusPill({ status }: { status: "pending review" | "approved" | "rejected" }) {
  const style = status === "approved" ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : status === "rejected" ? "bg-rose-50 text-rose-700 ring-rose-100" : "bg-amber-50 text-amber-700 ring-amber-100";
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.01em] ring-1 ${style}`}>{status}</span>;
}

export default function ProofPilotLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const nav = <nav className="space-y-1.5" aria-label="ProofPilot navigation">{navigation.map(({ href, label, icon: Icon }) => {
    const active = href === "/" ? location === "/" : location.startsWith(href.split("/: ")[0].replace("/: ", "")) || (href.includes("review") && location.startsWith("/review")) || (href.includes("demo") && location.startsWith("/demo"));
    return <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}><Icon className="size-4" />{label}</Link>;
  })}</nav>;
  return <div className="min-h-screen bg-[#f7f8f5] text-slate-900">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200/80 bg-[#fbfcfa] px-4 py-5 md:flex">
      <Link href="/" className="mb-9 flex items-center gap-3 px-2"><span className="grid size-9 place-items-center rounded-xl bg-[#0b3b36] text-white shadow-lg shadow-emerald-900/10"><Sparkles className="size-4" /></span><span><strong className="block text-[15px] tracking-tight">ProofPilot</strong><span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64817b]">Document trust</span></span></Link>
      {nav}
      <div className="mt-auto rounded-2xl border border-[#dce9e5] bg-[#f1f7f5] p-3.5"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#0b3b36]"><span className="size-1.5 rounded-full bg-emerald-500" />Live evidence workflow</div><div className="space-y-1.5 text-xs leading-5 text-slate-500"><p className="flex items-center gap-1.5"><Sparkles className="size-3 text-[#267264]" />Nutrient DWS: extract + finalize</p><p className="flex items-center gap-1.5"><Globe2 className="size-3 text-[#267264]" />SerpApi: review-time context</p></div></div>
    </aside>
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-[#fbfcfa]/90 px-4 backdrop-blur md:hidden"><Link href="/" className="flex items-center gap-2 font-semibold"><span className="grid size-8 place-items-center rounded-lg bg-[#0b3b36] text-white"><Sparkles className="size-4" /></span>ProofPilot</Link><button aria-label="Open navigation" className="grid size-10 place-items-center rounded-lg hover:bg-slate-100" onClick={() => setOpen(true)}><Menu className="size-5" /></button></header>
    {open && <div className="fixed inset-0 z-40 bg-slate-950/30 md:hidden" onClick={() => setOpen(false)}><aside className="h-full w-72 bg-[#fbfcfa] p-5 shadow-2xl" onClick={event => event.stopPropagation()}><div className="mb-8 flex items-center justify-between"><span className="font-semibold">ProofPilot</span><button aria-label="Close navigation" className="grid size-9 place-items-center rounded-lg hover:bg-slate-100" onClick={() => setOpen(false)}><X className="size-4" /></button></div>{nav}</aside></div>}
    <main className="min-h-screen md:pl-64">{children}</main>
  </div>;
}
