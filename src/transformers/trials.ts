// src/transformers/trials.ts
type AnyRow = Record<string, any>;

function s(v: any) {
  return String(v ?? "").trim();
}

/**
 * trials 关键字段：
 * - user_id
 * - class_status (你口径：end = 出席)
 * - class_start_ksa / class_date_ksa (给 tab0 用来筛时间范围)
 */
export function transformTrials(rows: AnyRow[]): AnyRow[] {
  if (!Array.isArray(rows)) return [];

  return rows
    .map((r) => {
      const user_id = s(r.user_id);
      if (!user_id) return null;

      const class_status = s(
        r.class_status ??
          r.status ??
          r.attendance_status ??
          r.attend_status ??
          r.trial_status
      );

      // 你表里有 class_start_ksa: "2026-03-01 23:00 ~ 23:30"
      // 我们提取日期部分，给 tab0 做范围判断
      const class_start_ksa = s(r.class_start_ksa || r.class_date_ksa || r.start_time_ksa || r.class_date);
      const class_date_ksa =
        class_start_ksa && class_start_ksa.length >= 10 ? class_start_ksa.slice(0, 10) : "";

      const booked_at = s(r.booked_at);

      const agent_id = s(r.agent_id || r.sales_id || r.consultant_id);
      const sales_id = agent_id; // 统一字段名，方便后续 join

      return {
        ...r,
        user_id,
        class_status,
        class_start_ksa,
        class_date_ksa,
        booked_at,
        agent_id,
        sales_id,
      };
    })
    .filter(Boolean) as AnyRow[];
}