import { Resend } from "resend";

let resendInstance: Resend | null = null;

/** Resend シングルトンを返す。RESEND_API_KEY 未設定時は null（開発環境対応） */
export function getResend(): Resend | null {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[Email] RESEND_API_KEY is not set — メール送信をスキップします");
      return null;
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}
