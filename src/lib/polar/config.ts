import { Polar } from "@polar-sh/sdk";

export function getPolarAccessToken(): string {
  const token = process.env.POLAR_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "POLAR_ACCESS_TOKEN が設定されていません。環境変数を確認してください。"
    );
  }
  return token;
}

export function getPolarWebhookSecret(): string {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error(
      "POLAR_WEBHOOK_SECRET が設定されていません。環境変数を確認してください。"
    );
  }
  return secret;
}

export function getPolarServer(): "sandbox" | "production" {
  const mode = process.env.POLAR_MODE;
  if (mode === "production") return "production";
  return "sandbox";
}

let _polar: Polar | null = null;

export function getPolar(): Polar {
  if (!_polar) {
    _polar = new Polar({
      accessToken: getPolarAccessToken(),
      server: getPolarServer(),
    });
  }
  return _polar;
}
