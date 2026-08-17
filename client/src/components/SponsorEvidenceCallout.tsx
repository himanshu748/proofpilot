import { Fingerprint, Globe2, ScanSearch } from "lucide-react";

export function SponsorEvidenceCallout({ isSample }: { isSample: boolean }) {
  return (
    <section className="mb-5 grid gap-3 rounded-2xl border border-[#d8e9e4] bg-[#f4faf8] p-4 md:grid-cols-2">
      <div className="flex gap-3 border-b border-[#d8e9e4] pb-3 md:border-b-0 md:border-r md:pb-0 md:pr-4">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-[#287063] shadow-sm"><ScanSearch className="size-4" /></span>
        <div>
          <p className="text-xs font-semibold text-[#153d36]">Nutrient DWS — decision evidence</p>
          <p className="mt-1 text-[11px] leading-5 text-[#52756c]">Extraction supplies confidence and source evidence; finalization is gated until the reviewer resolves every required exception.</p>
        </div>
      </div>
      <div className="flex gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-[#287063] shadow-sm"><Globe2 className="size-4" /></span>
        <div>
          <p className="text-xs font-semibold text-[#153d36]">SerpApi — attributable review context</p>
          <p className="mt-1 text-[11px] leading-5 text-[#52756c]">
            {isSample
              ? "Live issuer research is available only for an authenticated private record; the public sample never sends its content to external research."
              : "Research uses the issuer and open review topic, then records the returned public sources with this document’s audit trail. It informs a human decision; it does not verify one automatically."}
          </p>
        </div>
      </div>
      <div className="md:col-span-2 flex items-center gap-1.5 border-t border-[#d8e9e4] pt-3 text-[10px] font-medium text-[#47776c]">
        <Fingerprint className="size-3" /> Source evidence, public research, and reviewer action remain attributable in one proof record.
      </div>
    </section>
  );
}
