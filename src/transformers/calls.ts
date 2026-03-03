// src/transformers/calls.ts
type AnyRow = Record<string, any>;

function s(v: any) {
  return String(v ?? "").trim();
}
function toNum(v: any) {
  const n = Number(String(v ?? "").replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

// 你的 calls user_id 可能是 "student (62442011)"
function extractUserId(raw: string): string {
  const t = s(raw);
  const m = t.match(/\((\d+)\)/);
  if (m) return m[1];
  // 纯数字就直接用
  if (/^\d+$/.test(t)) return t;
  return t; // 兜底
}

export function transformCalls(rows: AnyRow[]): AnyRow[] {
  if (!Array.isArray(rows)) return [];

  return rows
    .map((r) => {
      const user_id = extractUserId(s(r.user_id));
      const sales_agent = s(r.seat_id || r.sales_name || r.agent || r.sales_agent);
      const connect_time = s(r.connect_time_sec || r.connect_time || r.outbound_time);
      const call_duration_sec = toNum(r.call_duration_sec);

      return {
        ...r,
        user_id,
        sales_agent,
        connect_time,
        call_duration_sec,
      };
    })
    .filter(Boolean) as AnyRow[];
}