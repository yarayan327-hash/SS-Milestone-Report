// src/App.tsx
import React, { useEffect, useMemo, useState } from "react";
import "./index.css";

import { fetchTable } from "./utils/csv";

import { transformAgents } from "./transformers/agents";
import { transformLeads } from "./transformers/leads";
import { transformTrials } from "./transformers/trials";
import { transformOrders } from "./transformers/orders";
import { transformCalls } from "./transformers/calls";

import { computeTab0ProjectOverview } from "./metrics/tab0ProjectOverview";
import { computeTab1 } from "./metrics/tab1";
import { computeTab2 } from "./metrics/tab2";
import { computeTab3SalesMtdCalendar } from "./metrics/tab3SalesMtdCalendar";

type TabKey = "tab0" | "tab1" | "tab2" | "tab3";
type Scope = "mtd" | "daily" | "all";

const PATHS = {
  agents: "/data/dim_agents.csv",
  leads: "/data/fact_leads.csv",
  calls: "/data/fact_calls.csv",
  orders: "/data/fact_orders.csv",
  trials: "/data/fact_trials.csv",
};

function fmt(n: number) {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString();
}
function fmtMoney(n: number) {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString();
}
function fmtPct(x: number) {
  if (!Number.isFinite(x)) return "0.0%";
  return `${(x * 100).toFixed(1)}%`;
}
function deltaClass(delta: number) {
  if (!Number.isFinite(delta) || delta === 0) return "";
  return delta > 0 ? "pos" : "neg";
}

/** ---------- Small UI components (V1) ---------- */

function Card({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div className={`card ${className ?? ""}`.trim()} style={style}>
      {children}
    </div>
  );
}

function SectionTitle({
  title,
  hint,
  right,
}: {
  title: string;
  hint?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="sectionHead">
      <div>
        <h2 className="h2">{title}</h2>
        {hint ? <div className="hint">{hint}</div> : null}
      </div>
      {right ? <div className="pills">{right}</div> : null}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button className={`pill ${active ? "active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button className={`tab ${active ? "active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

function KPI({
  title,
  value,
  sub,
  delta,
  tone = "default",
}: {
  title: string;
  value: string;
  sub?: string;
  delta?: number;
  tone?: "default" | "muted";
}) {
  // 让 Tab1/2/3 不再出现“巨大数字 + 乱飞文案”，统一字号体系
  const valueStyle: React.CSSProperties =
    tone === "muted"
      ? { color: "var(--text-primary)", fontSize: 48 }
      : { fontSize: 54 };

  return (
    <div className="kpiCard">
      <div className="kpiTitle">{title}</div>
      <div className="kpiValue" style={valueStyle}>
        {value}
      </div>
      {sub ? <div className="kpiSub" style={{ fontSize: 16, fontWeight: 900 }}>{sub}</div> : null}
      {typeof delta === "number" ? (
        <div className={`delta ${deltaClass(delta)}`} style={{ fontSize: 16 }}>
          vs LM: {delta > 0 ? `+${fmt(delta)}` : fmt(delta)}
        </div>
      ) : null}
    </div>
  );
}

function DebugBlock({ data }: { data: any }) {
  return (
    <details style={{ marginTop: 12 }}>
      <summary style={{ fontWeight: 900, cursor: "pointer" }}>Debug</summary>
      <pre className="pre">{JSON.stringify(data, null, 2)}</pre>
    </details>
  );
}

function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        borderRadius: 16,
      }}
    >
      {children}
    </div>
  );
}

function DataLoadStatus({
  agentsLen,
  leadsLen,
  callsLen,
  ordersLen,
  trialsLen,
}: {
  agentsLen: number;
  leadsLen: number;
  callsLen: number;
  ordersLen: number;
  trialsLen: number;
}) {
  return (
    <details style={{ marginTop: 12 }}>
      <summary style={{ fontWeight: 900, cursor: "pointer" }}>Data Load Status</summary>
      <div style={{ marginTop: 10 }}>
        <div className="grid kpi" style={{ gridTemplateColumns: "repeat(5, minmax(0,1fr))" as any }}>
          <KPI title="agents" value={fmt(agentsLen)} tone="muted" />
          <KPI title="leads" value={fmt(leadsLen)} tone="muted" />
          <KPI title="calls" value={fmt(callsLen)} tone="muted" />
          <KPI title="orders" value={fmt(ordersLen)} tone="muted" />
          <KPI title="trials" value={fmt(trialsLen)} tone="muted" />
        </div>
      </div>
    </details>
  );
}

/** Safe getters / normalizers */
function safeArr<T = any>(x: any): T[] {
  return Array.isArray(x) ? x : [];
}
function safeStr(x: any, fallback = "") {
  if (typeof x === "string") return x;
  if (x == null) return fallback;
  return String(x);
}
function normalizeGroupKey(x: any) {
  const s = safeStr(x, "0").trim();
  if (!s) return "000";
  // 如果是 "2" -> "002"，如果是 "002" -> "002"
  if (/^\d+$/.test(s)) return s.padStart(3, "0").slice(-3);
  // 非纯数字就原样（但避免空）
  return s;
}

export default function App() {
  const [tab, setTab] = useState<TabKey>("tab0");
  const [scope, setScope] = useState<Scope>("mtd");
  const [reportDate, setReportDate] = useState<string>("2026-02-27");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [raw, setRaw] = useState<{
    agents: any[];
    leads: any[];
    calls: any[];
    orders: any[];
    trials: any[];
  }>({ agents: [], leads: [], calls: [], orders: [], trials: [] });

  async function reloadAll() {
    setErr("");
    setLoading(true);
    try {
      const [agents, leads, calls, orders, trials] = await Promise.all([
        fetchTable(PATHS.agents),
        fetchTable(PATHS.leads),
        fetchTable(PATHS.calls),
        fetchTable(PATHS.orders),
        fetchTable(PATHS.trials),
      ]);

      setRaw({
        agents: Array.isArray(agents) ? agents : [],
        leads: Array.isArray(leads) ? leads : [],
        calls: Array.isArray(calls) ? calls : [],
        orders: Array.isArray(orders) ? orders : [],
        trials: Array.isArray(trials) ? trials : [],
      });
    } catch (e: any) {
      setErr(String(e?.message ?? e ?? "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reloadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- transforms（兜底成数组）----
  const agents = useMemo(() => transformAgents(raw.agents ?? []), [raw.agents]);
  const leads = useMemo(() => transformLeads(raw.leads ?? []), [raw.leads]);
  const calls = useMemo(() => transformCalls(raw.calls ?? []), [raw.calls]);
  const orders = useMemo(() => transformOrders(raw.orders ?? []), [raw.orders]);
  const trials = useMemo(() => transformTrials(raw.trials ?? []), [raw.trials]);

  // ---- compute ----
  const tab0 = useMemo(() => {
    try {
      return computeTab0ProjectOverview({ reportDate, scope, agents, leads, trials, orders } as any);
    } catch (e: any) {
      return { error: String(e?.message ?? e ?? "Tab0 build error") } as any;
    }
  }, [reportDate, scope, agents, leads, trials, orders]);

  const tab1 = useMemo(() => {
    try {
      return computeTab1({ reportDate, agents, leads, trials, orders, calls } as any);
    } catch (e: any) {
      return { error: String(e?.message ?? e ?? "Tab1 build error") } as any;
    }
  }, [reportDate, agents, leads, trials, orders, calls]);

  const tab2 = useMemo(() => {
    try {
      return computeTab2({ reportDate, agents, leads, trials, orders, calls } as any);
    } catch (e: any) {
      return { error: String(e?.message ?? e ?? "Tab2 build error") } as any;
    }
  }, [reportDate, agents, leads, trials, orders, calls]);

  const tab3 = useMemo(() => {
    try {
      return computeTab3SalesMtdCalendar({ reportDate, agents, orders, scope: "mtd" } as any);
    } catch (e: any) {
      return { error: String(e?.message ?? e ?? "Tab3 build error") } as any;
    }
  }, [reportDate, agents, orders]);

  const loadedHint = `Loaded rows: agents ${agents?.length ?? 0}, leads ${leads?.length ?? 0}, calls ${
    calls?.length ?? 0
  }, orders ${orders?.length ?? 0}, trials ${trials?.length ?? 0}`;

  const topError =
    err ||
    (tab === "tab0" && (tab0 as any)?.error) ||
    (tab === "tab1" && (tab1 as any)?.error) ||
    (tab === "tab2" && (tab2 as any)?.error) ||
    (tab === "tab3" && (tab3 as any)?.error) ||
    "";

  /** --------- Tab2 derived display (no logic change; UI only) --------- */
  const tab2Debug = (tab2 as any)?.debug ?? {};
  const tab2AttendedTrials = Number(tab2Debug?.attendedTrials ?? 0);
  const tab2CallsUsers = Number(tab2Debug?.callsUsers ?? 0);
  const tab2OrdersUsers = Number(tab2Debug?.ordersUsers ?? 0);
  const tab2Note = safeStr(tab2Debug?.note ?? "", "");

  /** --------- Tab3 derived display (UI fix for missing name/color) --------- */
  const tab3GroupTable = safeArr<any>((tab3 as any)?.groupTable);
  const tab3Workdays = safeArr<string>((tab3 as any)?.workdays);
  const tab3Cells = (tab3 as any)?.cells ?? {};

  // Top3（可选展示，不影响主体）
  const top3 = useMemo(() => {
    // 取 groupTable 的前三名作为 “Top3 组别”，比 unknown 稳定
    const rows = tab3GroupTable
      .map((r) => ({
        sales_group: normalizeGroupKey(r?.sales_group),
        orders: Number(r?.orders ?? 0),
        gmv: Number(r?.gmv ?? 0),
      }))
      .sort((a, b) => (b.gmv ?? 0) - (a.gmv ?? 0))
      .slice(0, 3);

    return rows;
  }, [tab3GroupTable]);

  return (
    <div className="page">
      {/* Topbar */}
      <Card className="topbar">
        <div>
          <div className="title">Sales BI Dashboard</div>
          <div className="subtitle">数据路径固定： public/data/*.csv（覆盖文件后点 Reload 即可更新）。</div>
        </div>

        <div className="topbar-actions">
          <button className="btn primary" onClick={reloadAll} disabled={loading}>
            {loading ? "Loading..." : "Reload"}
          </button>
        </div>
      </Card>

      {/* Controls */}
      <Card className="controls">
        <div className="control">
          <label>reportDate (KSA, T-1)</label>
          <input value={reportDate} onChange={(e) => setReportDate(e.target.value.slice(0, 10))} />
        </div>

        <div className="tabs">
          <TabButton active={tab === "tab0"} onClick={() => setTab("tab0")}>
            Tab0 项目总览
          </TabButton>
          <TabButton active={tab === "tab1"} onClick={() => setTab("tab1")}>
            Tab1 日报看板
          </TabButton>
          <TabButton active={tab === "tab2"} onClick={() => setTab("tab2")}>
            Tab2 课后长尾追踪
          </TabButton>
          <TabButton active={tab === "tab3"} onClick={() => setTab("tab3")}>
            Tab3 销售MTD日历
          </TabButton>
        </div>
      </Card>

      {topError ? (
        <div className="errorBanner">
          <b>Error:</b> {topError}
        </div>
      ) : null}

      <div className="content">
        {/* ================= TAB0（保持你的原样式口径）================= */}
        {tab === "tab0" ? (
          <Card style={{ padding: 18 }}>
            <SectionTitle
              title="项目总览（MTD to T-1, KSA）"
              hint="口径：MTD=当月1号~T-1；Daily=仅T-1当天；All-time=截至T-1累计"
              right={
                <>
                  <Pill active={scope === "mtd"} onClick={() => setScope("mtd")}>
                    MTD
                  </Pill>
                  <Pill active={scope === "daily"} onClick={() => setScope("daily")}>
                    Daily
                  </Pill>
                  <Pill active={scope === "all"} onClick={() => setScope("all")}>
                    All-time
                  </Pill>
                </>
              }
            />

            <div className="grid kpi">
              <KPI
                title="线索 Leads"
                value={fmt((tab0 as any)?.mtd?.leads ?? 0)}
                delta={(tab0 as any)?.vs_last_month_same_period?.leads_delta}
              />
              <KPI
                title="预约 Booked"
                value={fmt((tab0 as any)?.mtd?.booked ?? 0)}
                delta={(tab0 as any)?.vs_last_month_same_period?.booked_delta}
              />
              <KPI
                title="出席 Attended"
                value={fmt((tab0 as any)?.mtd?.attended ?? 0)}
                delta={(tab0 as any)?.vs_last_month_same_period?.attended_delta}
              />
              <KPI
                title="订单 Orders"
                value={fmt((tab0 as any)?.mtd?.orders ?? 0)}
                delta={(tab0 as any)?.vs_last_month_same_period?.orders_delta}
              />
              <KPI
                title="GMV"
                value={fmtMoney((tab0 as any)?.mtd?.gmv ?? 0)}
                delta={(tab0 as any)?.vs_last_month_same_period?.gmv_delta}
              />

              <KPI
                title="预约率"
                value={fmtPct((tab0 as any)?.rates?.booking_rate ?? 0)}
                sub={`${fmt((tab0 as any)?.mtd?.booked ?? 0)}/${fmt((tab0 as any)?.mtd?.leads ?? 0)}`}
              />
              <KPI
                title="出席率"
                value={fmtPct((tab0 as any)?.rates?.attendance_rate ?? 0)}
                sub={`${fmt((tab0 as any)?.mtd?.attended ?? 0)}/${fmt((tab0 as any)?.mtd?.booked ?? 0)}`}
              />
              <KPI
                title="出席转化率"
                value={fmtPct((tab0 as any)?.rates?.attended_conversion ?? 0)}
                sub={`${fmt((tab0 as any)?.mtd?.orders ?? 0)}/${fmt((tab0 as any)?.mtd?.attended ?? 0)}`}
              />
              <KPI
                title="线索转化率"
                value={fmtPct((tab0 as any)?.rates?.lead_conversion ?? 0)}
                sub={`${fmt((tab0 as any)?.mtd?.orders ?? 0)}/${fmt((tab0 as any)?.mtd?.leads ?? 0)}`}
              />
              <KPI title="AOV" value={fmt(Math.round((tab0 as any)?.rates?.aov ?? 0))} sub="GMV / Orders" />
            </div>

            <DataLoadStatus
              agentsLen={agents?.length ?? 0}
              leadsLen={leads?.length ?? 0}
              callsLen={calls?.length ?? 0}
              ordersLen={orders?.length ?? 0}
              trialsLen={trials?.length ?? 0}
            />

            <DebugBlock data={(tab0 as any)?.debug ?? tab0} />
          </Card>
        ) : null}

        {/* ================= TAB1（统一卡片，不再“大号 JSON 块”）================= */}
        {tab === "tab1" ? (
          <Card style={{ padding: 18 }}>
            <SectionTitle title="Tab1 日报看板" hint="（先保留数据输出，但用统一卡片/表格样式承载）" />

            <div className="grid kpi">
              <KPI title="Booked" value={fmt((tab1 as any)?.booked ?? 0)} />
              <KPI title="Attended" value={fmt((tab1 as any)?.attended ?? 0)} />
              <KPI title="Orders" value={fmt((tab1 as any)?.orders ?? 0)} />
              <KPI title="GMV" value={fmtMoney((tab1 as any)?.gmv ?? 0)} />
            </div>

            <DataLoadStatus
              agentsLen={agents?.length ?? 0}
              leadsLen={leads?.length ?? 0}
              callsLen={calls?.length ?? 0}
              ordersLen={orders?.length ?? 0}
              trialsLen={trials?.length ?? 0}
            />

            <DebugBlock data={tab1} />
          </Card>
        ) : null}

        {/* ================= TAB2（修：字号/颜色/Note 不再炸裂；表格可横向滚动）================= */}
        {tab === "tab2" ? (
          <Card style={{ padding: 18 }}>
            <SectionTitle
              title="Tab2 课后长尾追踪"
              hint={`有效通话口径：call_duration_sec ≥ 20  |  reportDate: ${reportDate}`}
            />

            <div className="grid kpi" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" as any }}>
              <KPI title="Attended Trials" value={fmt(tab2AttendedTrials)} />
              <KPI title="Users w/ Effective Call" value={fmt(tab2CallsUsers)} />
              <KPI title="Users w/ Orders" value={fmt(tab2OrdersUsers)} />
              <KPI
                title="Note"
                value={tab2Note ? "Info" : "—"}
                sub={
                  tab2Note
                    ? tab2Note.length > 48
                      ? `${tab2Note.slice(0, 48)}…`
                      : tab2Note
                    : "No note"
                }
                tone="muted"
              />
            </div>

            {/* 表格承载 b_bySalesDate（保持你原来字段） */}
            <Card style={{ padding: 14, marginTop: 12 }}>
              <TableWrap>
                <table className="table" style={{ width: "100%", minWidth: 720 }}>
                  <thead>
                    <tr>
                      <th style={{ whiteSpace: "nowrap" }}>sales_group</th>
                      <th style={{ whiteSpace: "nowrap" }}>sales_agent</th>
                      <th style={{ whiteSpace: "nowrap" }}>class_date</th>
                      <th style={{ textAlign: "right", whiteSpace: "nowrap" }}>attended</th>
                      <th style={{ textAlign: "right", whiteSpace: "nowrap" }}>follow_24h</th>
                      <th style={{ textAlign: "right", whiteSpace: "nowrap" }}>lost_24h</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeArr<any>((tab2 as any)?.b_bySalesDate).slice(0, 50).map((r, idx) => (
                      <tr key={`${r?.sales_agent}-${r?.class_date}-${idx}`}>
                        <td style={{ whiteSpace: "nowrap" }}>{r?.sales_group || "(empty)"}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{r?.sales_agent || "(empty)"}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{r?.class_date}</td>
                        <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>{fmt(r?.attended ?? 0)}</td>
                        <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>{fmt(r?.follow_24h ?? 0)}</td>
                        <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>{fmt(r?.lost_24h ?? 0)}</td>
                      </tr>
                    ))}

                    {safeArr<any>((tab2 as any)?.b_bySalesDate).length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ color: "var(--text-secondary)", fontWeight: 900, paddingTop: 14 }}>
                          当前 b_bySalesDate 为空（数据口径/筛选条件导致），请展开 Debug 看原因。
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </TableWrap>
            </Card>

            <DataLoadStatus
              agentsLen={agents?.length ?? 0}
              leadsLen={leads?.length ?? 0}
              callsLen={calls?.length ?? 0}
              ordersLen={orders?.length ?? 0}
              trialsLen={trials?.length ?? 0}
            />

            <DebugBlock data={tab2} />
          </Card>
        ) : null}

        {/* ================= TAB3（修：销售名称/颜色映射/表格文字显示不全）================= */}
        {tab === "tab3" ? (
          <Card style={{ padding: 18 }}>
            <SectionTitle
              title="Sales MTD Calendar"
              hint={`范围：${(tab3 as any)?.range?.start} ~ ${(tab3 as any)?.range?.end}（工作日）`}
              right={
                top3?.length ? (
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 900, color: "var(--text-secondary)" }}>Top3:</span>
                    {top3.map((r, i) => (
                      <span
                        key={`${r.sales_group}-${i}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 12px",
                          borderRadius: 999,
                          border: "var(--border)",
                          background: "#fff",
                          fontWeight: 900,
                        }}
                      >
                        <span style={{ color: "var(--text-secondary)" }}>G{r.sales_group}</span>
                        <span style={{ color: "var(--primary-blue)" }}>{fmtMoney(r.gmv)}</span>
                      </span>
                    ))}
                  </div>
                ) : null
              }
            />

            {/* 组别排行表 */}
            <Card style={{ padding: 14, marginTop: 12 }}>
              <div className="h2" style={{ fontSize: 18, marginBottom: 10 }}>
                组别 MTD GMV（排序）
              </div>

              <TableWrap>
                <table className="table" style={{ width: "100%", minWidth: 520 }}>
                  <thead>
                    <tr>
                      <th style={{ whiteSpace: "nowrap" }}>sales_group</th>
                      <th style={{ textAlign: "right", whiteSpace: "nowrap" }}>orders</th>
                      <th style={{ textAlign: "right", whiteSpace: "nowrap" }}>gmv</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tab3GroupTable.map((r) => {
                      const g = normalizeGroupKey(r?.sales_group);
                      return (
                        <tr key={g || "(empty)"}>
                          <td style={{ whiteSpace: "nowrap" }}>{g || "(empty)"}</td>
                          <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>{fmt(r?.orders ?? 0)}</td>
                          <td style={{ textAlign: "right", fontWeight: 900, whiteSpace: "nowrap" }}>
                            {fmtMoney(r?.gmv ?? 0)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </TableWrap>
            </Card>

            <div style={{ marginTop: 12, fontWeight: 900, color: "var(--text-secondary)" }}>
              工作日日历（把销售放到“最后一次成单日期”的格子里）
            </div>

            <div className="calendarGrid">
              {tab3Workdays.map((d) => {
                const itemsRaw = safeArr<any>(tab3Cells?.[d]);
                // 修复 “没有名字 + 没有颜色”
                const items = itemsRaw.map((it) => {
                  const sg = normalizeGroupKey(it?.sales_group);
                  const name =
                    it?.sales_name ??
                    it?.sales_agent ??
                    it?.agent_name ??
                    it?.name ??
                    it?.sales ??
                    it?.agent ??
                    "(unknown)";
                  return {
                    ...it,
                    __sg: sg,
                    __name: safeStr(name, "(unknown)"),
                    __orders: Number(it?.orders ?? 0),
                    __gmv: Number(it?.gmv ?? 0),
                  };
                });

                return (
                  <div key={d} className="dayCell">
                    <div className="dayTitle">{d}</div>

                    {items?.length ? (
                      items.map((it) => (
                        <div
                          key={`${it.__name}-${it.__sg}-${it.__orders}-${it.__gmv}`}
                          className={`miniRow g${it.__sg}`}
                          title={`${it.__name} | G${it.__sg} | ${fmt(it.__orders)} orders | ${fmtMoney(it.__gmv)} gmv`}
                          style={{
                            // 让名字可见 + 不被挤压
                            justifyContent: "space-between",
                          }}
                        >
                          <span className="dot" />
                          <span
                            className="name"
                            style={{
                              maxWidth: 150,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {it.__name}
                          </span>
                          <span className="meta" style={{ whiteSpace: "nowrap" }}>
                            {fmt(it.__orders)} 单 · {fmtMoney(it.__gmv)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="empty">—</div>
                    )}
                  </div>
                );
              })}
            </div>

            <DataLoadStatus
              agentsLen={agents?.length ?? 0}
              leadsLen={leads?.length ?? 0}
              callsLen={calls?.length ?? 0}
              ordersLen={orders?.length ?? 0}
              trialsLen={trials?.length ?? 0}
            />

            <DebugBlock data={(tab3 as any)?.debug ?? tab3} />
          </Card>
        ) : null}
      </div>

      <div className="footer">{loadedHint}</div>
    </div>
  );
}