import ProofPilotLayout, { StatusPill } from "@/components/ProofPilotLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, ChevronRight, FileText, Fingerprint, Plus, ScanSearch, ShieldCheck, Sparkles } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

const documents = [
  { name: "northstar-services-invoice.pdf", type: "Invoice · 1 page", confidence: "91%", status: "pending review" as const, date: "Today, 09:42" },
  { name: "helio-vendor-onboarding.pdf", type: "Vendor intake · 4 pages", confidence: "97%", status: "approved" as const, date: "Yesterday" },
  { name: "apex-trade-certificate.pdf", type: "Trade document · 3 pages", confidence: "68%", status: "rejected" as const, date: "Aug 14" },
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
    if (file.type !== "application/pdf") {
      toast.error("Choose a PDF document.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("PDFs must be 10 MB or smaller.");
      return;
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = "";
    for (let index = 0; index < bytes.length; index += 8192) {
      const chunk = bytes.subarray(index, index + 8192);
      for (let offset = 0; offset < chunk.length; offset += 1) binary += String.fromCharCode(chunk[offset] ?? 0);
    }
    await upload.mutateAsync({ fileName: file.name, contentBase64: btoa(binary) });
  };
  return <ProofPilotLayout><div className="mx-auto max-w-7xl px-4 py-7 sm:px-7 lg:px-10 lg:py-9">
    <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d9e9e4] bg-[#f2f8f6] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2d6258]"><span className="size-1.5 rounded-full bg-emerald-500" />Governed document intelligence</div><h1 className="font-display text-3xl font-semibold tracking-[-0.045em] text-[#102622] sm:text-4xl">Make every document<br className="hidden sm:block" /> defensible.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">ProofPilot combines confidence-scored extraction, human review, and tamper-evident finalization in one evidence-first workspace.</p></div><div><input ref={fileInputRef} className="sr-only" type="file" accept="application/pdf,.pdf" onChange={event => handleUpload(event.target.files?.[0])} /><button disabled={upload.isPending} onClick={() => fileInputRef.current?.click()} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0b3b36] px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-[#12554d] active:scale-[.97] disabled:cursor-wait disabled:opacity-70"><Plus className="size-4" />{upload.isPending ? "Processing PDF" : "Upload PDF"}</button></div></section>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={FileText} label="Documents processed" value="24" note="This month" /><Metric icon={ScanSearch} label="Average confidence" value="92.4%" note="Across extracted fields" accent /><Metric icon={Fingerprint} label="Human interventions" value="7" note="Low-confidence corrections" /><Metric icon={ShieldCheck} label="Finalized records" value="16" note="Traceable outputs" /></section>
    <section className="mt-7 grid gap-5 xl:grid-cols-[1.55fr_.85fr]"><div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_12px_32px_-24px_rgba(15,23,42,.3)]"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 className="text-sm font-semibold">Document ledger</h2><p className="mt-0.5 text-xs text-slate-500">Every decision is recorded with its source evidence.</p></div><button className="text-xs font-semibold text-[#176457] hover:text-[#0b3b36]">View all</button></div><div className="divide-y divide-slate-100">{documents.map(document => <div key={document.name} className="group flex flex-col gap-3 px-5 py-4 transition hover:bg-[#fbfdfc] sm:flex-row sm:items-center sm:px-6"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#eef6f3] text-[#176457]"><FileText className="size-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{document.name}</p><p className="mt-0.5 text-xs text-slate-500">{document.type} <span className="mx-1.5 text-slate-300">•</span>{document.date}</p></div><div className="flex items-center gap-4 sm:gap-6"><div className="text-left sm:text-right"><p className="text-sm font-semibold text-slate-700">{document.confidence}</p><p className="text-[11px] text-slate-400">confidence</p></div><StatusPill status={document.status} />{document.status === "pending review" ? <Link href="/review/sample-invoice" className="grid size-8 place-items-center rounded-lg text-slate-400 transition group-hover:bg-[#e7f3ef] group-hover:text-[#176457]"><ChevronRight className="size-4" /></Link> : <span className="size-8" />}</div></div>)}</div></div>
      <aside className="rounded-2xl bg-[#0c302c] p-5 text-white shadow-xl shadow-emerald-950/10 sm:p-6"><div className="mb-8 flex items-start justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#91b9af]">Review queue</p><h2 className="mt-2 text-xl font-semibold tracking-tight">One record needs judgment.</h2></div><span className="grid size-9 place-items-center rounded-xl bg-white/10"><Sparkles className="size-4 text-[#a9f2dd]" /></span></div><div className="rounded-xl border border-white/10 bg-white/[.06] p-4"><p className="text-sm font-semibold">northstar-services-invoice.pdf</p><p className="mt-1 text-xs leading-5 text-[#b5d0c9]">Payment terms scored 72% confidence. Resolve it before finalization.</p><Link href="/review/sample-invoice" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#a9f2dd]">Open review <ArrowUpRight className="size-3.5" /></Link></div><div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/10 pt-5"><div><p className="text-2xl font-semibold">1</p><p className="mt-1 text-[11px] text-[#91b9af]">awaiting review</p></div><div><p className="text-2xl font-semibold">04:18</p><p className="mt-1 text-[11px] text-[#91b9af]">average handling</p></div></div></aside></section>
    <section className="mt-7 rounded-2xl border border-[#d6e7e2] bg-[#f1f7f5] p-5 sm:flex sm:items-center sm:justify-between sm:p-6"><div className="flex gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-[#176457] shadow-sm"><ShieldCheck className="size-4" /></span><div><p className="text-sm font-semibold text-[#153d36]">Built around the Nutrient DWS document-trust workflow</p><p className="mt-1 text-xs leading-5 text-[#52756c]">Extract → review exceptions → record decisions → finalize a verifiable artifact.</p></div></div><Link href="/submission" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#176457] sm:mt-0">View hackathon evidence <ArrowUpRight className="size-3.5" /></Link></section>
  </div></ProofPilotLayout>;
}

function Metric({ icon: Icon, label, value, note, accent = false }: { icon: typeof FileText; label: string; value: string; note: string; accent?: boolean }) {
  return <div className={`rounded-2xl border p-4 sm:p-5 ${accent ? "border-[#cfe5de] bg-[#f2f8f5]" : "border-slate-200/90 bg-white"}`}><div className="mb-6 flex items-center justify-between"><span className={`grid size-8 place-items-center rounded-lg ${accent ? "bg-[#dcefe9] text-[#176457]" : "bg-slate-100 text-slate-500"}`}><Icon className="size-4" /></span><span className="text-[11px] font-medium text-slate-400">{note}</span></div><p className="text-2xl font-semibold tracking-tight text-slate-800">{value}</p><p className="mt-1 text-xs font-medium text-slate-500">{label}</p></div>;
}
