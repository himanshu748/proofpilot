import ProofPilotLayout, { StatusPill } from "@/components/ProofPilotLayout";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Check, ChevronDown, CircleAlert, ExternalLink, FileText, Fingerprint, Globe2, History, LockKeyhole, SearchCheck, ShieldCheck, Sparkles, X } from "lucide-react";
import { Link, useRoute } from "wouter";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type ReviewField = { id?: string; key: string; label: string; value: string; confidence: number; citation: string; reviewedAt?: Date | null };
const sampleFields: ReviewField[] = [
  { key: "invoice", label: "Invoice number", value: "NTH-2026-0418", confidence: .98, citation: "Header · invoice identifier" },
  { key: "vendor", label: "Vendor", value: "Northstar Field Services Ltd.", confidence: .96, citation: "Bill from · vendor name" },
  { key: "total", label: "Total due", value: "$12,480.00", confidence: .99, citation: "Totals · payment summary" },
  { key: "terms", label: "Payment terms", value: "Net 30", confidence: .72, citation: "Terms · lower-left note" },
];

export default function Review() {
  const [, params] = useRoute("/review/:id");
  const documentId = params?.id ?? "sample-invoice";
  const isSample = documentId === "sample-invoice";
  const documentQuery = trpc.proofpilot.get.useQuery({ documentId }, { enabled: !isSample, retry: false });
  const updateFieldMutation = trpc.proofpilot.updateField.useMutation({ onError: error => toast.error(error.message) });
  const finalizeMutation = trpc.proofpilot.finalize.useMutation({
    onSuccess: () => { toast.success("Document approved and finalization recorded."); documentQuery.refetch(); },
    onError: error => toast.error(error.message),
  });
  const rejectMutation = trpc.proofpilot.reject.useMutation({
    onSuccess: () => { toast.message("Document marked rejected."); documentQuery.refetch(); },
    onError: error => toast.error(error.message),
  });
  const issuerResearchMutation = trpc.proofpilot.researchIssuer.useMutation({
    onSuccess: () => { toast.success("Public issuer research recorded in the audit trail."); documentQuery.refetch(); },
    onError: error => toast.error(error.message),
  });
  const [localFields, setLocalFields] = useState(sampleFields);
  const [sampleStatus, setSampleStatus] = useState<"pending review" | "approved" | "rejected">("pending review");
  const [sampleAudit, setSampleAudit] = useState(["Sample invoice added to the governed workspace.", "Nutrient DWS extraction produced four source-grounded fields.", "Payment terms routed to a reviewer at 72% confidence."]);
  const [liveEdits, setLiveEdits] = useState<Record<string, string>>({});

  const fields = useMemo<ReviewField[]>(() => {
    if (isSample) return localFields;
    return (documentQuery.data?.fields ?? []).map(field => ({
      id: field.id,
      key: field.id,
      label: field.label,
      value: liveEdits[field.id] ?? field.value,
      confidence: Number(field.confidence),
      citation: field.sourceCitation ?? `Page ${field.sourcePage ?? 1}`,
      reviewedAt: field.reviewedAt,
    }));
  }, [documentQuery.data, isSample, liveEdits, localFields]);
  const status = isSample ? sampleStatus : (documentQuery.data?.document.status ?? "pending review");
  const fileName = isSample ? "northstar-services-invoice.pdf" : (documentQuery.data?.document.fileName ?? "Loading document…");
  const auditItems = isSample
    ? sampleAudit.map((message, index) => ({ message, at: `2026-08-17T${String(9 + index).padStart(2, "0")}:42:00Z` }))
    : (documentQuery.data?.audit ?? []).map(event => ({ message: event.message, at: event.createdAt.toISOString() }));
  const reviewCount = fields.filter(field => field.confidence < .86 && (!isSample ? !field.reviewedAt : field.confidence < .86)).length;

  const changeField = (field: ReviewField, value: string) => {
    if (isSample) setLocalFields(current => current.map(item => item.key === field.key ? { ...item, value, confidence: 1 } : item));
    else if (field.id) setLiveEdits(current => ({ ...current, [field.id!]: value }));
  };
  const saveField = (field: ReviewField) => {
    if (!isSample && field.id && liveEdits[field.id] !== undefined) {
      updateFieldMutation.mutate({ documentId, fieldId: field.id, value: liveEdits[field.id] });
      toast.success(`${field.label} marked as reviewed.`);
      documentQuery.refetch();
    }
  };
  const approve = () => {
    if (isSample) {
      if (reviewCount) return toast.error("Confirm the low-confidence field first.");
      setSampleStatus("approved");
      setSampleAudit(current => ["Reviewer approved the document and requested a tamper-evident finalization record.", ...current]);
      return toast.success("Document marked approved in the demo workflow.");
    }
    finalizeMutation.mutate({ documentId });
  };
  const reject = () => {
    if (isSample) { setSampleStatus("rejected"); setSampleAudit(current => ["Reviewer rejected the document after reviewing the extracted evidence.", ...current]); return toast.message("Document marked rejected in the demo workflow."); }
    rejectMutation.mutate({ documentId });
  };

  return <ProofPilotLayout><div className="mx-auto max-w-7xl px-4 py-7 sm:px-7 lg:px-10 lg:py-9">
    <div className="mb-6 flex items-center justify-between"><Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"><ArrowLeft className="size-3.5" />Workspace</Link><StatusPill status={status} /></div>
    <div className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between"><div><div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-[#478076]"><Sparkles className="size-3.5" />Human-in-the-loop review</div><h1 className="text-2xl font-semibold tracking-[-.04em] text-[#132b26] sm:text-3xl">{fileName}</h1><p className="mt-2 text-sm text-slate-500">Resolve uncertain data against the source document before it can be finalized.</p></div><div className="flex items-center gap-2 text-xs text-slate-500"><Fingerprint className="size-4 text-[#3b766a]" />Proof record <span className="font-mono text-[11px] text-slate-400">{isSample ? "pp_d4a68e1" : documentId.slice(0, 10)}</span></div></div>
    {!isSample && documentQuery.isLoading ? <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading protected document record…</div> : <><div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_460px]"><section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_15px_35px_-28px_rgba(15,23,42,.4)]"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div className="flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-lg bg-rose-50 text-rose-500"><FileText className="size-4" /></span><div><p className="text-sm font-semibold">Source PDF</p><p className="text-[11px] text-slate-400">Original retained · source evidence preserved</p></div></div><button className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">100% <ChevronDown className="size-3.5" /></button></div><div className="min-h-[600px] bg-[#e9ece9] p-5 sm:p-9"><div className="mx-auto min-h-[530px] max-w-[520px] bg-white p-7 shadow-[0_16px_30px_-18px_rgba(15,23,42,.35)] sm:p-10"><div className="flex items-start justify-between border-b border-slate-200 pb-7"><div><div className="mb-3 h-3 w-24 rounded-full bg-[#0b3b36]" /><p className="text-sm font-semibold tracking-tight">SOURCE RECORD</p><p className="text-[10px] uppercase tracking-[.18em] text-slate-400">{fileName}</p></div><ShieldCheck className="size-5 text-[#438073]" /></div><div className="mt-9 rounded-xl border border-[#dce9e5] bg-[#f4faf8] p-5"><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#4b8074]">Evidence-first review</p><p className="mt-2 text-sm font-medium leading-6 text-[#254d45]">ProofPilot preserves the original PDF and grounds every extracted value in a source citation.</p></div><div className="mt-10 space-y-3">{fields.slice(0, 3).map(field => <div key={field.key} className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs"><span className="text-slate-400">{field.label}</span><span className="font-semibold text-slate-700">{field.value}</span></div>)}</div><div className="mt-16 rounded-md bg-amber-50 px-3 py-2 text-[10px] text-amber-700"><strong>Review signal:</strong> {reviewCount ? `${reviewCount} field requires confirmation` : "all required fields confirmed"}</div></div></div></section>
      <section className="space-y-5"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_15px_35px_-28px_rgba(15,23,42,.4)]"><div className="mb-5 flex items-start justify-between"><div><p className="text-sm font-semibold">Extracted evidence</p><p className="mt-1 text-xs leading-5 text-slate-500">Field-level confidence determines where review is required.</p></div><span className="rounded-lg bg-[#edf7f4] px-2 py-1 text-[10px] font-semibold text-[#277061]">Nutrient DWS</span></div><div className="space-y-3">{fields.map(field => { const uncertain = field.confidence < .86 && (isSample || !field.reviewedAt); return <div key={field.key} className={`rounded-xl border p-3.5 ${uncertain ? "border-amber-200 bg-amber-50/45" : "border-slate-100 bg-[#fcfdfc]"}`}><div className="mb-2 flex items-center justify-between"><label htmlFor={field.key} className="text-xs font-semibold text-slate-700">{field.label}</label><span className={`text-[10px] font-semibold ${uncertain ? "text-amber-700" : "text-emerald-700"}`}>{Math.round(field.confidence * 100)}% confidence</span></div><input id={field.key} value={field.value} onChange={event => changeField(field, event.target.value)} onBlur={() => saveField(field)} className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none transition focus:border-[#6fa89b] focus:ring-2 focus:ring-[#dcefe9]" /><p className="mt-2 text-[10px] text-slate-400">{field.citation}</p>{uncertain && <p className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-amber-700"><CircleAlert className="size-3" />Manual confirmation required</p>}</div>; })}</div></div><div className="rounded-2xl border border-[#d6e7e2] bg-[#f3f8f6] p-4"><div className="flex gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-[#287063] shadow-sm"><Globe2 className="size-4" /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold text-[#153d36]">Public issuer evidence</p><span className="text-[10px] font-semibold text-[#3d786c]">SerpApi</span></div>{isSample ? <p className="mt-1.5 text-[11px] leading-5 text-[#52756c]">Live issuer research is available after a private document is uploaded. The public sample never sends its content to external research.</p> : <><p className="mt-1.5 text-[11px] leading-5 text-[#52756c]">Searches only the extracted issuer name plus public-policy terms. The query and results become an audit event.</p><button disabled={issuerResearchMutation.isPending} onClick={() => issuerResearchMutation.mutate({ documentId })} className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#b9d9d0] bg-white px-2.5 text-[11px] font-semibold text-[#236f60] transition hover:bg-[#eaf5f1] disabled:opacity-60"><SearchCheck className="size-3.5" />{issuerResearchMutation.isPending ? "Researching…" : "Research issuer"}</button>{issuerResearchMutation.data && <div className="mt-3 space-y-2 border-t border-[#d6e7e2] pt-3">{issuerResearchMutation.data.findings.length ? issuerResearchMutation.data.findings.map(finding => <a key={finding.link} href={finding.link} target="_blank" rel="noreferrer" className="block rounded-lg bg-white p-2.5 transition hover:bg-[#edf7f4]"><p className="flex items-center gap-1 text-[11px] font-semibold text-[#235a4f]">{finding.title}<ExternalLink className="size-3" /></p><p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">{finding.snippet}</p></a>) : <p className="text-[11px] text-[#52756c]">No public results were returned for the extracted issuer.</p>}</div>}</>}</div></div></div><div className="rounded-2xl border border-[#d9e9e4] bg-[#f2f8f5] p-4"><div className="flex gap-3"><LockKeyhole className="mt-0.5 size-4 shrink-0 text-[#2a7465]" /><div><p className="text-xs font-semibold text-[#153d36]">Finalization guardrail</p><p className="mt-1 text-[11px] leading-5 text-[#52756c]">{reviewCount ? `${reviewCount} field still needs human confirmation before a live finalization request.` : "All fields are confirmed. The signing adapter can create the final tamper-evident record."}</p></div></div></div><div className="grid grid-cols-2 gap-3"><button disabled={rejectMutation.isPending} onClick={reject} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white text-xs font-semibold text-rose-700 transition hover:bg-rose-50 active:scale-[.97] disabled:opacity-60"><X className="size-3.5" />Reject</button><button disabled={finalizeMutation.isPending || Boolean(reviewCount)} onClick={approve} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0b3b36] text-xs font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-[#12554d] active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-60"><Check className="size-3.5" />{finalizeMutation.isPending ? "Finalizing…" : "Approve & finalize"}</button></div></section></div><section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5"><div className="mb-4 flex items-center gap-2"><History className="size-4 text-[#438073]" /><h2 className="text-sm font-semibold">Audit trail</h2></div><ol className="grid gap-3 md:grid-cols-3">{auditItems.map((event, index) => <li key={`${event.message}-${index}`} className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#4a8276]">{index === 0 ? "Latest event" : "Recorded event"}</p><p className="mt-1.5 text-xs leading-5 text-slate-600">{event.message}</p><p className="mt-2 text-[10px] text-slate-400">{new Date(event.at).toLocaleString()}</p></li>)}</ol></section></>}</div></ProofPilotLayout>;
}
