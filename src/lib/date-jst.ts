/**
 * JST (Asia/Tokyo) タイムゾーンヘルパー
 *
 * Vercel は UTC で動作するため、日付関連は全てこのモジュールを経由する。
 */

const TZ = "Asia/Tokyo";

/** 現在のJST Date オブジェクトを返す */
export function nowJST(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: TZ }));
}

/** 今日の日付を YYYY-MM-DD 文字列で返す（JST） */
export function todayJST(): string {
  return formatDateJST(nowJST());
}

/** Date → YYYY-MM-DD 文字列（JST） */
export function formatDateJST(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** N日後の YYYY-MM-DD（JST） */
export function daysFromNowJST(n: number): string {
  const jst = nowJST();
  jst.setDate(jst.getDate() + n);
  return formatDateJST(jst);
}

/** 今月1日 00:00:00（JST）の Date を返す */
export function monthStartJST(): Date {
  const jst = nowJST();
  jst.setDate(1);
  jst.setHours(0, 0, 0, 0);
  return jst;
}

/** Date → ISO 8601 文字列（JST表現、タイムゾーンオフセット付き） */
export function formatDateTimeJST(date: Date): string {
  return date.toLocaleString("sv-SE", { timeZone: TZ }).replace(" ", "T") + "+09:00";
}

/** 現在のJST時刻の「時」(0-23) */
export function currentHourJST(): number {
  return nowJST().getHours();
}

/** 現在のJST曜日 (0=日, 1=月, ..., 6=土) */
export function currentDayJST(): number {
  return nowJST().getDay();
}
