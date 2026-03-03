// src/metrics/tab2/tab2Core.ts
import { attachSalesMeta } from "../../transformers/joinSales";
import { isAttendedStatus } from "../../utils/status";

const EFFECTIVE_SEC = 20; // ✅ 有效通话：>=20s
const HOUR_MS = 60 * 60 * 1000;

function toTsMs(v: any): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const s = String(v ?? "").trim();
  if (!s) return null;
  const t = Date.parse(s);
  return Number.isFinite(t) ? t : null;
}

function ymdFromTs(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function computeTab2(input: any) {
  const reportDate = input.reportDate;

  const agentsArr = Array.isArray(input.agents) ? input.agents : [];
  const trials = Array.isArray(input.trials) ? input.trials : [];
  const calls = Array.isArray(input.calls) ? input.calls : [];
  const orders = Array.isArray(input.orders) ? input.orders : [];

  // 统一补销售字段
  const trials2 = attachSalesMeta(trials, agentsArr, (r: any) => ({ sales_id: r.agent_id }));
  const calls2 = attachSalesMeta(calls, agentsArr, (r: any) => ({ sales_name: r.sales_name }));
  const orders2 = attachSalesMeta(orders, agentsArr, (r: any) => ({ sales_name: r.sales_name_raw }));

  // 关键依赖：trials.start_ts_ms / calls.outbound_ts_ms
  const attendedTrials = trials2.filter((r: any) => isAttendedStatus(r.class_status));

  // ✅ 有效通话过滤（>=20秒）
  const effectiveCalls = calls2.filter((c: any) => Number(c.call_duration_sec ?? 0) >= EFFECTIVE_SEC);

  // 建索引：按 user_id 聚合通话
  const callsByUser = new Map<string, any[]>();
  for (const c of effectiveCalls) {
    const uid = String(c.user_id ?? "");
    if (!uid) continue;
    (callsByUser.get(uid) ?? callsByUser.set(uid, []).get(uid)!).push(c);
  }

  // 订单按 user_id 聚合
  const ordersByUser = new Map<string, any[]>();
  for (const o of orders2) {
    const uid = String(o.user_id ?? "");
    if (!uid) continue;
    (ordersByUser.get(uid) ?? ordersByUser.set(uid, []).get(uid)!).push(o);
  }

  // 产出：按销售 + 体验课日期（class_date）统计跟进
  const b_bySalesDate: any[] = [];
  const keyMap = new Map<string, any>();

  for (const t of attendedTrials) {
    const uid = String(t.user_id ?? "");
    const sales_group = String(t.sales_group ?? "");
    const sales_agent = String(t.sales_name ?? t.sales_agent ?? "");
    const startTs = Number(t.start_ts_ms ?? 0);

    if (!uid || !startTs) continue;

    const class_date = ymdFromTs(startTs);
    const key = `${sales_group}||${sales_agent}||${class_date}`;

    if (!keyMap.has(key)) {
      keyMap.set(key, {
        sales_group,
        sales_agent,
        class_date,
        attended: 0,
        follow_1h: 0,
        follow_24h: 0,
        follow_48h: 0,
        follow_7d: 0,
        lost_1h: 0,
        lost_24h: 0,
        lost_48h: 0,
        lost_7d: 0,
      });
    }

    const row = keyMap.get(key);
    row.attended += 1;

    const userCalls = callsByUser.get(uid) ?? [];
    const afterCalls = userCalls
      .map((c) => toTsMs(c.outbound_ts_ms))
      .filter((x): x is number => !!x && x >= startTs)
      .sort((a, b) => a - b);

    const firstFollowTs = afterCalls.length ? afterCalls[0] : null;
    const delta = firstFollowTs ? firstFollowTs - startTs : null;

    const hit = (ms: number) => delta !== null && delta <= ms;

    row.follow_1h += hit(1 * HOUR_MS) ? 1 : 0;
    row.follow_24h += hit(24 * HOUR_MS) ? 1 : 0;
    row.follow_48h += hit(48 * HOUR_MS) ? 1 : 0;
    row.follow_7d += hit(7 * 24 * HOUR_MS) ? 1 : 0;

    row.lost_1h += !hit(1 * HOUR_MS) ? 1 : 0;
    row.lost_24h += !hit(24 * HOUR_MS) ? 1 : 0;
    row.lost_48h += !hit(48 * HOUR_MS) ? 1 : 0;
    row.lost_7d += !hit(7 * 24 * HOUR_MS) ? 1 : 0;
  }

  for (const v of keyMap.values()) b_bySalesDate.push(v);

  // 你原来的 a_byDate / d_unfollowed 先保留空数组（后续再补全）
  const a_byDate: any[] = [];
  const d_unfollowed: any[] = [];

  return {
    a_byDate,
    b_bySalesDate,
    d_unfollowed,
    debug: {
      attendedTrials: attendedTrials.length,
      callsUsers: callsByUser.size,
      ordersUsers: ordersByUser.size,
      note: "V2 enabled. Effective call = duration ≥ 20 sec.",
      reportDate,
    },
  };
}