// src/metrics/tab3SalesMtdCalendar.ts
import { isAttendedStatus } from "./../utils/status";

export interface Tab3Inputs {
  reportDate: string; // YYYY-MM-DD (T-1, KSA)
  agents?: any[];     // dim_agents: sales_id, sales_group, sales_name
  orders?: any[];     // fact_orders: sales_name_raw, processed_time, paid_amount
}

function toNum(x: any) {
  const n = Number(String(x ?? "0").replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

function toYMD(raw: any): string {
  const s = String(raw ?? "").trim();
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // YYYY/MM/DD ...
  let m = s.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})/);
  if (m) return `${m[1]}-${String(+m[2]).padStart(2, "0")}-${String(+m[3]).padStart(2, "0")}`;

  // YYYY-MM-DD ...
  m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${String(+m[2]).padStart(2, "0")}-${String(+m[3]).padStart(2, "0")}`;

  // DD/MM/YYYY ...
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) return `${m[3]}-${String(+m[2]).padStart(2, "0")}-${String(+m[1]).padStart(2, "0")}`;

  return "";
}

function monthStartYMD(reportDate: string) {
  const [y, m] = reportDate.split("-").map(Number);
  return `${y}-${String(m).padStart(2, "0")}-01`;
}

function inRangeYMD(ymd: string, start: string, end: string) {
  return !!ymd && ymd >= start && ymd <= end;
}

function isWeekend(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const day = dt.getDay(); // 0 Sun ... 6 Sat
  return day === 0 || day === 6;
}

function listWorkdays(start: string, end: string) {
  const out: string[] = [];
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  let cur = new Date(sy, sm - 1, sd);
  const endD = new Date(ey, em - 1, ed);
  while (cur.getTime() <= endD.getTime()) {
    const ymd = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
    if (!isWeekend(ymd)) out.push(ymd);
    cur = new Date(cur.getTime() + 24 * 60 * 60 * 1000);
  }
  return out;
}

export function computeTab3SalesMtdCalendar(input: Tab3Inputs) {
  const reportDate = String(input.reportDate || "").slice(0, 10);
  const start = monthStartYMD(reportDate);
  const end = reportDate;

  const agents = Array.isArray(input.agents) ? input.agents : [];
  const orders = Array.isArray(input.orders) ? input.orders : [];

  // map: sales_name -> group
  const name2group = new Map<string, string>();
  for (const a of agents) {
    const name = String(a.sales_name ?? "").trim();
    if (!name) continue;
    name2group.set(name, String(a.sales_group ?? "").trim());
  }

  const ordersIn = orders
    .map((r) => {
      const ymd = toYMD(r.processed_time);
      const sales = String(r.sales_name_raw ?? "").trim();
      const gmv = toNum(r.paid_amount ?? r.amount ?? r.gmv);
      const group = name2group.get(sales) ?? "";
      return { ...r, ymd, sales, group, gmv };
    })
    .filter((r) => inRangeYMD(r.ymd, start, end));

  // Group GMV
  const groupAgg: Record<string, { sales_group: string; gmv: number; orders: number }> = {};
  for (const r of ordersIn) {
    const g = r.group || "(empty)";
    if (!groupAgg[g]) groupAgg[g] = { sales_group: g, gmv: 0, orders: 0 };
    groupAgg[g].gmv += r.gmv;
    groupAgg[g].orders += 1;
  }
  const groupTable = Object.values(groupAgg).sort((a, b) => b.gmv - a.gmv);

  // Sales MTD agg
  const salesAgg: Record<string, { sales: string; group: string; gmv: number; orders: number; lastOrderDate: string }> = {};
  for (const r of ordersIn) {
    const key = r.sales || "(empty)";
    if (!salesAgg[key]) salesAgg[key] = { sales: key, group: r.group || "", gmv: 0, orders: 0, lastOrderDate: "" };
    salesAgg[key].gmv += r.gmv;
    salesAgg[key].orders += 1;
    if (!salesAgg[key].lastOrderDate || r.ymd > salesAgg[key].lastOrderDate) salesAgg[key].lastOrderDate = r.ymd;
  }
  const salesRank = Object.values(salesAgg).sort((a, b) => b.gmv - a.gmv);

  // Calendar cells: date -> sales cards (put people into their lastOrderDate cell)
  const workdays = listWorkdays(start, end);
  const cellMap: Record<string, any[]> = {};
  for (const d of workdays) cellMap[d] = [];
  for (const s of salesRank) {
    if (s.lastOrderDate && cellMap[s.lastOrderDate]) {
      cellMap[s.lastOrderDate].push(s);
    }
  }
  // within a day, sort by gmv desc
  for (const d of workdays) cellMap[d].sort((a, b) => b.gmv - a.gmv);

  return {
    range: { start, end },
    groupTable,
    workdays,
    cells: cellMap,
    top3: salesRank.slice(0, 3),
    debug: {
      ordersIn: ordersIn.length,
      agents: agents.length,
      groups: groupTable.length,
      sales: salesRank.length,
    },
  };
}