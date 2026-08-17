import ProofPilotLayout, { StatusPill } from "@/components/ProofPilotLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { ArrowRight, ArrowUpRight, CheckCircle2, CircleDot, FileCheck2, FileText, Fingerprint, GitBranch, Globe2, LockKeyhole, Play, ScanSearch, Sparkles, UploadCloud } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { toast } from "sonner";

const proofSteps = [
  { number: "01", title: "Extract with source context", text: "Nutrient DWS converts a PDF into confidence-scored evidence.", icon: ScanSearch },
  { number: "02", title: "Pause for judgment", text: "Low-confidence fields move to human review instead of silently passing.", icon: CircleDot },
  { number: "03", title: "Research in the record", text: "SerpApi adds bounded public issuer context to the open exception.", icon: Globe2 },
  { number: "04", title: "Finalize defensibly", text: "After review, Nutrient signing creates the final tamper-evident record.", icon: FileCheck2 },
];

const sampleDocuments = [
  { name: "northstar-services-invoice.pdf", type: "Synthetic invoice · 1 page", confidence: "91%", status: "pending review" as const, note: "Payment terms needs confirmation" },
  { name: "helio-vendor-onboarding.pdf", type: "Representative workflow", confidence: "97%", status: "approved" as const, note: "Source and decision retained" },
  { name: "apex-trade-certificate.pdf", type: "Representative workflow", confidence: "68%", status: "rejected" as const, note: "Exception preserved for audit" },
];

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const upload = trpc.proofpilot.upload.useMutation({
    onSuccess: record => {
      toast.success("PDF stored and queued for review.");
      if (record?.document?.id) setLocation(`/review/${record.document.id}`);
    },
    onError: error => toast.error(error.message),
  });

  const handleUpload = async (file?: File) => {
    if (!file) return;
    if (!isAuthenticated) {
      toast.message("Sign in to upload and retain a document record.");
      startLogin();
      return;
    }
    if (file.type !== "application/pdf") return toast.error("Choose a PDF document.");
    if (file.size > 10 * 1024 * 1024) return toast.error("PDFs must be 10 MB or smaller.");
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = "";
    for (let index = 0; index < bytes.length; index += 8192) {
      const chunk = bytes.subarray(index, index + 8192);
      for (let offset = 0; offset < chunk.length; offset += 1) binary += String.fromCharCode(chunk[offset] ?? 0);
    }
    await upload.mutateAsync({ fileName: file.name, contentBase64: btoa(binary) });
  };

  return <ProofPilotLayout><div className="mx-auto max-w-7xl px-4 py-5 sm:px-7 sm:py-7 lg:px-10 lg:py-9">
    <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#082d29] px-6 py-9 text-white shadow-[0_32px_80px_-36px_rgba(6,46,42,.8)] sm:px-9 sm:py-11 lg:px-12 lg:py-14">
      <div className="absolute -right-24 -top-24 size-80 rounded-full bg-emerald-300/15 blur-3xl" />
      <div className="absolute -bottom-36 left-1/3 size-[30rem] rounded-full border border-white/10" />
      <div className="absolute inset-0 opacity-[.13] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:30px_30px] [mask-image:linear-gradient(130deg,black,transparent_72%)]" />
      <div className="relative grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.17em] text-[#b7f4df]"><span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_0_5px_rgba(110,231,183,.12)]" />Evidence-first document intelligence</div>
          <p className="mb-4 text-sm font-medium tracking-wide text-[#9ccfc2]">From source PDF to defensible decision</p>
          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[.96] tracking-[-.055em] sm:text-5xl lg:text-6xl">Every document gets a <span className="text-[#a9f2dd]">proof path.</span></h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#c7ddd7]">ProofPilot makes uncertainty visible: Nutrient DWS extracts the evidence, a human resolves exceptions, SerpApi adds attributable public context, and every action is retained in an audit trail.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input ref={fileInputRef} className="sr-only" type="file" accept="application/pdf,.pdf" onChange={event => handleUpload(event.target.files?.[0])} />
            <button disabled={upload.isPending} onClick={() => fileInputRef.current?.click()} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#c4f6df] px-5 text-sm font-bold text-[#082d29] shadow-lg shadow-black/10 transition hover:bg-white active:scale-[.97] disabled:cursor-wait disabled:opacity-70"><UploadCloud className="size-4" />{upload.isPending ? "Processing secure PDF" : "Upload a PDF"}</button>
            <Link href="/demo/sample-invoice" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[.06] px-5 text-sm font-semibold text-white transition hover:bg-white/10"><Play className="size-4 fill-current" />Explore public demo</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#acd2c6]"><span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-[#a9f2dd]" />Synthetic public demo</span><span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-[#a9f2dd]" />Live-validated integrations</span><span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-[#a9f2dd]" />Human-in-the-loop</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-[31rem] [perspective:1200px]">
          <div className="absolute -inset-5 rounded-[2rem] bg-emerald-300/10 blur-2xl" />
          <div className="relative rotate-[1.5deg] rounded-[1.6rem] border border-white/20 bg-[#f8fbf8] p-4 text-slate-900 shadow-[0_30px_40px_-20px_rgba(0,0,0,.6)] transition duration-500 hover:rotate-0 sm:p-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e2f2ed] text-[#126154]"><FileText className="size-5" /></span><div><p className="text-sm font-bold">northstar-services-invoice.pdf</p><p className="mt-0.5 text-[11px] text-slate-500">Synthetic invoice · Review workspace</p></div></div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 ring-1 ring-amber-100">pending review</span></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1.1fr_.9fr]"><div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">Source-grounded fields</p><div className="mt-3 space-y-3"><EvidenceRow label="Invoice total" value="$8,420.00" score="98%" /><EvidenceRow label="Issuer" value="Northstar Services" score="94%" /><EvidenceRow label="Payment terms" value="Net 30" score="72%" alert /></div></div><div className="rounded-xl bg-[#093b34] p-3 text-white"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a8d8ca]">Review signal</p><div className="mt-6"><span className="grid size-9 place-items-center rounded-xl bg-white/10"><LockKeyhole className="size-4 text-[#b7f4df]" /></span><p className="mt-3 text-sm font-bold leading-5">Finalization stays gated.</p><p className="mt-2 text-[11px] leading-5 text-[#afd2c8]">Resolve the exception, record the evidence, then create the final artifact.</p></div><div className="mt-5 flex items-center gap-1.5 text-[10px] font-bold text-[#b7f4df]"><span className="size-1.5 rounded-full bg-emerald-300" />Audit trail active</div></div></div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-[#d7e9e3] bg-[#edf7f3] px-3 py-2.5 text-[11px]"><span className="font-semibold text-[#155b50]">SerpApi research is available for this exception.</span><ArrowRight className="size-4 text-[#287166]" /></div>
          </div>
        </div>
      </div>
    </section>

    <section className="mt-7 grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_18px_45px_-34px_rgba(15,23,42,.35)] sm:p-7"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#44776d]">The product thesis</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-[-.045em] text-[#102622]">Don’t automate past uncertainty.</h2></div><p className="max-w-sm text-sm leading-6 text-slate-500">Every extraction, research result, reviewer correction, and finalization event is designed to be inspected later—not simply trusted now.</p></div><div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{proofSteps.map(step => { const Icon = step.icon; return <div key={step.number} className="rounded-2xl border border-slate-100 bg-[#fbfcfb] p-4 transition hover:-translate-y-0.5 hover:border-[#cfe5de] hover:shadow-lg hover:shadow-emerald-950/[.04]"><div className="flex items-center justify-between"><span className="text-[10px] font-bold tracking-[.14em] text-[#70a096]">{step.number}</span><Icon className="size-4 text-[#267264]" /></div><h3 className="mt-6 text-sm font-bold text-slate-800">{step.title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{step.text}</p></div>; })}</div></div>
      <div className="relative overflow-hidden rounded-3xl bg-[#dff2ea] p-6 text-[#103a33] shadow-[0_18px_45px_-34px_rgba(15,23,42,.35)] sm:p-7"><div className="absolute -right-12 -top-12 size-44 rounded-full border-[18px] border-white/30" /><p className="relative text-[10px] font-bold uppercase tracking-[.16em] text-[#3c786b]">Judge fast path</p><h2 className="relative mt-2 font-display text-3xl font-semibold tracking-[-.045em]">See the whole proof in minutes.</h2><p className="relative mt-3 text-sm leading-6 text-[#47766c]">Walk the synthetic PDF, resolve the open exception, inspect the audit trail, then verify the public source.</p><div className="relative mt-6 flex items-center gap-2 text-xs font-bold"><Link href="/demo/sample-invoice" className="inline-flex items-center gap-1 text-[#126154] hover:text-[#082d29]">Open demo <ArrowUpRight className="size-3.5" /></Link><span className="text-[#8cb9ad]">/</span><Link href="/submission" className="inline-flex items-center gap-1 text-[#126154] hover:text-[#082d29]">See evidence <ArrowUpRight className="size-3.5" /></Link></div></div>
    </section>

    <section className="mt-7 grid gap-4 lg:grid-cols-2">
      <SponsorPanel label="Nutrient DWS" eyebrow="Document engine" title="The evidence and the artifact." icon={<Sparkles className="size-5" />} description="Data Extraction produces confidence-scored source evidence. Processor signing creates the tamper-evident final record after human review." bullets={["Live-validated extraction on a synthetic PDF", "Guarded signing adapter with `/ByteRange` evidence"]} tone="dark" />
      <SponsorPanel label="SerpApi" eyebrow="Decision context" title="Research where judgment happens." icon={<Globe2 className="size-5" />} description="A bounded issuer-and-review-topic query is triggered only for an open exception, then its public findings are retained with the decision." bullets={["Live public issuer research in the reviewer workspace", "Query and findings persist in the audit trail"]} tone="light" />
    </section>

    <section className="mt-7 grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_18px_45px_-34px_rgba(15,23,42,.35)]"><div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#497e72]">Representative queue</p><h2 className="mt-1 text-lg font-bold tracking-tight text-slate-800">Evidence stays with the decision.</h2><p className="mt-1 text-xs leading-5 text-slate-500">Sample records show explicit reviewer statuses—not unattended automation.</p></div><Link href="/review/sample-invoice" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176457] hover:text-[#0b3b36]">Open review workspace <ArrowUpRight className="size-3.5" /></Link></div><div className="divide-y divide-slate-100">{sampleDocuments.map(document => <div key={document.name} className="group flex flex-col gap-3 px-5 py-4 transition hover:bg-[#fbfdfc] sm:flex-row sm:items-center sm:px-7"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eef6f3] text-[#176457]"><FileText className="size-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800">{document.name}</p><p className="mt-0.5 text-xs text-slate-500">{document.type}<span className="mx-1.5 text-slate-300">•</span>{document.note}</p></div><div className="flex items-center gap-4 sm:gap-6"><div className="text-left sm:text-right"><p className="text-sm font-bold text-slate-700">{document.confidence}</p><p className="text-[10px] font-medium uppercase tracking-[.12em] text-slate-400">confidence</p></div><StatusPill status={document.status} />{document.status === "pending review" ? <Link href="/review/sample-invoice" aria-label="Open sample review" className="grid size-8 place-items-center rounded-lg text-slate-400 transition group-hover:bg-[#e7f3ef] group-hover:text-[#176457]"><ArrowRight className="size-4" /></Link> : <span className="size-8" />}</div></div>)}</div></div>
      <aside className="relative overflow-hidden rounded-3xl bg-[#102622] p-6 text-white shadow-[0_18px_45px_-34px_rgba(15,23,42,.5)] sm:p-7"><div className="absolute -bottom-8 -right-8 size-40 rounded-full border border-white/10" /><div className="relative"><span className="grid size-10 place-items-center rounded-xl bg-[#b7f4df] text-[#0b3b36]"><Fingerprint className="size-5" /></span><p className="mt-7 text-[10px] font-bold uppercase tracking-[.16em] text-[#97bdb4]">Open by design</p><h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-[-.045em]">Inspect the implementation, not just the interface.</h2><p className="mt-3 text-sm leading-6 text-[#bed4ce]">The public repository includes setup instructions, tests, integration boundaries, and a judge-evidence pack.</p><a href="https://github.com/himanshu748/proofpilot" target="_blank" rel="noreferrer" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/[.07] px-4 text-sm font-bold text-white transition hover:bg-white/10"><GitBranch className="size-4" />View public source <ArrowUpRight className="size-4" /></a></div></aside>
    </section>
  </div></ProofPilotLayout>;
}

function EvidenceRow({ label, value, score, alert = false }: { label: string; value: string; score: string; alert?: boolean }) {
  return <div className={`rounded-lg px-2.5 py-2 ${alert ? "bg-amber-50 ring-1 ring-amber-100" : "bg-slate-50"}`}><div className="flex items-center justify-between gap-2"><span className="truncate text-[10px] font-semibold text-slate-500">{label}</span><span className={`text-[10px] font-bold ${alert ? "text-amber-700" : "text-emerald-700"}`}>{score}</span></div><p className="mt-0.5 truncate text-xs font-bold text-slate-800">{value}</p></div>;
}

function SponsorPanel({ label, eyebrow, title, icon, description, bullets, tone }: { label: string; eyebrow: string; title: string; icon: ReactNode; description: string; bullets: string[]; tone: "dark" | "light" }) {
  const dark = tone === "dark";
  return <article className={`relative overflow-hidden rounded-3xl p-6 shadow-[0_18px_45px_-34px_rgba(15,23,42,.35)] sm:p-7 ${dark ? "bg-[#0a3b35] text-white" : "border border-[#d6e8e2] bg-[#f2f8f5] text-[#133a34]"}`}><div className={`absolute -right-12 -top-12 size-40 rounded-full border-[18px] ${dark ? "border-white/[.06]" : "border-white/65"}`} /><div className="relative"><div className="flex items-center gap-3"><span className={`grid size-10 place-items-center rounded-xl ${dark ? "bg-white/10 text-[#b7f4df]" : "bg-white text-[#176457] shadow-sm"}`}>{icon}</span><div><p className={`text-[10px] font-bold uppercase tracking-[.16em] ${dark ? "text-[#92bcb1]" : "text-[#5f8d83]"}`}>{eyebrow}</p><p className="mt-0.5 text-sm font-bold">{label}</p></div></div><h2 className="mt-7 max-w-sm font-display text-3xl font-semibold tracking-[-.045em]">{title}</h2><p className={`mt-3 max-w-xl text-sm leading-6 ${dark ? "text-[#c1d7d1]" : "text-[#55766d]"}`}>{description}</p><div className={`mt-6 grid gap-2 border-t pt-5 sm:grid-cols-2 ${dark ? "border-white/10" : "border-[#d5e7e1]"}`}>{bullets.map(bullet => <div key={bullet} className={`flex gap-2 text-xs font-semibold leading-5 ${dark ? "text-[#d4e8e2]" : "text-[#2d6258]"}`}><CheckCircle2 className={`mt-0.5 size-3.5 shrink-0 ${dark ? "text-[#a9f2dd]" : "text-[#348070]"}`} />{bullet}</div>)}</div></div></article>;
}
