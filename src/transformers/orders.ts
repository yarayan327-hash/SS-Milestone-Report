// src/transformers/orders.ts
type AnyRow = Record<string, any>;

function s(v: any) {
  return String(v ?? "").trim();
}

function toNum(v: any) {
  const n = Number(String(v ?? "").replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

// 支持: "2026/2/27 14:27" / "2026-02-27 14:27" / "2026-02-27T..."
function parseYMDFromDatetime(raw: string): string {
  const t = s(raw);
  if (!t) return "";

  // normalize
  const x = t.replace(/\//g, "-").replace("T", " ").trim();
  // x: "2026-2-27 14:27" or "2026-02-27 14:27"
  const m = x.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!m) return "";

  const y = m[1];
  const mm = String(Number(m[2])).padStart(2, "0");
  const dd = String(Number(m[3])).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

/**
 * fact_orders.csv sample:
 * sales_name_raw = "51habiba.hassan" (你保证和 dim_agents 完全一致 ✅)
 * processed_time = "2025/10/29 4:31"  (你口径用它筛时间)
 * paid_amount = "599.00"
 */
export function transformOrders(rows: AnyRow[]): AnyRow[] {
  if (!Array.isArray(rows)) return [];

  return rows
    .map((r) => {
      const order_id = s(r.order_id);
      const user_id = s(r.user_id);
      const sales_name = s(r.sales_name_raw || r.sales_name || r.agent_name || r.consultant_name);
      const processed_time = s(r.processed_time || r.processed_time_ksa);
      const processed_date = parseYMDFromDatetime(processed_time);

      // paid_amount 可能是字符串 "599.00"
      const paid_amount = toNum(r.paid_amount ?? r.amount ?? r.gmv ?? r.amount_usd);

      // sales_group 可能长这样： "前端销售部001组"
      // 这里尽量抽出 001 / 002
      const sgRaw = s(r.sales_group);
      const sgMatch = sgRaw.match(/(\d{3})/);
      const sales_group = s(r.sales_group_code || (sgMatch ? sgMatch[1] : ""));

      if (!order_id && !user_id) return null;

      return {
        ...r,
        order_id,
        user_id,
        sales_name,          // ✅ 给 tab3 join dim_agents 用
        sales_group,         // 有就用，没有也没关系（tab3 也可从 dim_agents 取）
        processed_time,
        processed_date,      // ✅ 给 tab3/tab0 做范围过滤用
        paid_amount,         // ✅ GMV
      };
    })
    .filter(Boolean) as AnyRow[];
}