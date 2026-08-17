export const CONFIDENCE_REVIEW_THRESHOLD = 0.86;

export type ProofField = {
  key: string;
  label: string;
  value: string;
  confidence: number;
  page: number;
  citation: string;
  bounds?: { x: number; y: number; width: number; height: number };
};

export function normalizeConfidence(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(1, parsed));
}

export function needsHumanReview(confidence: number) {
  return normalizeConfidence(confidence) < CONFIDENCE_REVIEW_THRESHOLD;
}

export function averageConfidence(fields: Array<Pick<ProofField, "confidence">>) {
  if (!fields.length) return 0;
  return fields.reduce((sum, field) => sum + normalizeConfidence(field.confidence), 0) / fields.length;
}

export function classifyStatus(fields: Array<Pick<ProofField, "confidence">>): "pending review" | "approved" {
  return fields.some(field => needsHumanReview(field.confidence)) ? "pending review" : "approved";
}

export const demoFields: ProofField[] = [
  { key: "invoice_number", label: "Invoice number", value: "NTH-2026-0418", confidence: 0.98, page: 1, citation: "Header · invoice identifier", bounds: { x: 904, y: 210, width: 244, height: 32 } },
  { key: "vendor", label: "Vendor", value: "Northstar Field Services Ltd.", confidence: 0.96, page: 1, citation: "Bill from · vendor name", bounds: { x: 116, y: 286, width: 360, height: 34 } },
  { key: "total_due", label: "Total due", value: "$12,480.00", confidence: 0.99, page: 1, citation: "Totals · payment summary", bounds: { x: 936, y: 1658, width: 210, height: 38 } },
  { key: "payment_terms", label: "Payment terms", value: "Net 30", confidence: 0.72, page: 1, citation: "Terms · lower-left note", bounds: { x: 112, y: 1720, width: 168, height: 28 } },
];

export function buildDemoAudit() {
  return [
    { eventType: "document.uploaded", message: "Sample invoice added to the governed workspace.", at: "2026-08-17T09:42:08.000Z" },
    { eventType: "nutrient.extraction.completed", message: "Confidence-scored fields and source citations returned for review.", at: "2026-08-17T09:42:14.000Z" },
    { eventType: "review.required", message: "Payment terms flagged because confidence is below the review threshold.", at: "2026-08-17T09:42:14.000Z" },
  ];
}
