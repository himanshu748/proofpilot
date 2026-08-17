import ProofPilotLayout, { StatusPill } from "@/components/ProofPilotLayout";
import {
  ArrowUpRight,
  CheckCircle2,
  FileSearch,
  FileText,
  Fingerprint,
  Globe2,
  Link2,
  LockKeyhole,
  ScanSearch,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { Link } from "wouter";

const workflow = [
  {
    icon: ScanSearch,
    title: "Extract",
    description: "Nutrient DWS returns source-grounded fields with a confidence signal for every important value.",
    badge: "Nutrient DWS",
  },
  {
    icon: UserRoundCheck,
    title: "Review",
    description: "A low-confidence payment term is surfaced to a human rather than silently accepted.",
    badge: "1 exception",
  },
  {
    icon: Globe2,
    title: "Research",
    description: "For a private review, SerpApi adds live public issuer context for the open review topic and records it with the decision.",
    badge: "SerpApi",
  },
  {
    icon: Fingerprint,
    title: "Record",
    description: "Extraction, research, review, and finalization events receive attributable timestamps in one audit trail.",
    badge: "audit-ready",
  },
  {
    icon: LockKeyhole,
    title: "Finalize",
    description: "After approval, the live-validated Nutrient DWS signing adapter creates a tamper-evident output record.",
    badge: "ByteRange verified",
  },
];

export default function PublicDemo() {
  return (
    <ProofPilotLayout>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-7 lg:px-10 lg:py-11">
        <div className="mb-10 flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#edf7f4] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.14em] text-[#287063]">
              <Link2 className="size-3" /> Public proof link
            </div>
            <h1 className="text-3xl font-semibold tracking-[-.045em] text-[#112a25]">A document decision you can inspect.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              This shareable judge demo follows a representative invoice from Nutrient evidence to a human decision, live public research context, and a tamper-evident final record.
            </p>
          </div>
          <StatusPill status="pending review" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_15px_35px_-28px_rgba(15,23,42,.35)] sm:p-7">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-500"><FileText className="size-5" /></span>
              <div>
                <p className="text-sm font-semibold">northstar-services-invoice.pdf</p>
                <p className="mt-1 text-xs text-slate-500">Invoice · 1 page · Synthetic document for product demonstration</p>
              </div>
            </div>
            <a href="/manus-storage/proofpilot-northstar-sample-invoice_cd5375ac.pdf" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-[#d4e7e1] bg-[#f5faf8] px-3 py-2 text-xs font-semibold text-[#256f60] transition hover:bg-[#eaf5f1]">
              <FileSearch className="size-3.5" /> Open the sample PDF <ArrowUpRight className="size-3.5" />
            </a>

            <div className="mt-8 space-y-0">
              {workflow.map(({ icon: Icon, title, description, badge }, index) => (
                <div key={title} className="relative flex gap-4 pb-7 last:pb-0">
                  <div className="relative z-10 grid size-9 shrink-0 place-items-center rounded-xl bg-[#eef6f3] text-[#207363]"><Icon className="size-4" /></div>
                  {index < workflow.length - 1 && <span className="absolute left-[18px] top-9 h-[calc(100%-18px)] w-px bg-[#dce9e5]" />}
                  <div className="pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">{title}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">{badge}</span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl bg-[#0c302c] p-5 text-white sm:p-6">
            <ShieldCheck className="size-5 text-[#a7ead8]" />
            <p className="mt-5 text-lg font-semibold leading-7">Trust is a workflow, not a model output.</p>
            <p className="mt-3 text-xs leading-5 text-[#bad6cf]">
              Nutrient DWS does the core document work. SerpApi provides public research context exactly when an uncertain field needs review. The human reviewer owns the decision.
            </p>
            <Link href="/review/sample-invoice" className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#a7ead8]">
              Inspect the review workspace <ArrowUpRight className="size-3.5" />
            </Link>
          </aside>
        </div>

        <div className="mt-5 rounded-2xl border border-[#d7e8e3] bg-[#f1f7f5] p-4 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-[#287063]" />
            <p className="text-xs leading-5 text-[#416c62]">
              <strong className="text-[#1b4f45]">Demo boundary:</strong> This public route contains a synthetic invoice. Live issuer research is run only from an authenticated private document and is reviewed as context, never automatic verification.
            </p>
          </div>
          <span className="mt-3 block text-[10px] font-semibold uppercase tracking-[.12em] text-[#47776c] sm:mt-0">share-safe</span>
        </div>
      </main>
    </ProofPilotLayout>
  );
}
