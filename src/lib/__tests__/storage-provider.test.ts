import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  VercelBlobStorageProvider,
  SupabaseStorageProvider,
  getStorageProvider,
} from "@/lib/storage/provider";

const PUBLIC_URL =
  "https://example.supabase.co/storage/v1/object/public/hojokin-files/test/file.pdf";

// Mock @supabase/supabase-js
vi.mock("@supabase/supabase-js", () => {
  const mockStorage = {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ error: null }),
      download: vi.fn().mockResolvedValue({
        data: new Blob([Buffer.from([1, 2, 3])]),
        error: null,
      }),
      remove: vi.fn().mockResolvedValue({ error: null }),
      getPublicUrl: vi.fn().mockReturnValue({
        data: { publicUrl: PUBLIC_URL },
      }),
    })),
  };

  return {
    createClient: vi.fn(() => ({ storage: mockStorage })),
  };
});

describe("VercelBlobStorageProvider", () => {
  const provider = new VercelBlobStorageProvider();

  it("upload は 'not implemented' エラーをスローする", async () => {
    await expect(
      provider.upload("path/file.pdf", Buffer.from([]), "application/pdf")
    ).rejects.toThrow("not implemented");
  });

  it("download は 'not implemented' エラーをスローする", async () => {
    await expect(provider.download("path/file.pdf")).rejects.toThrow("not implemented");
  });

  it("delete は 'not implemented' エラーをスローする", async () => {
    await expect(provider.delete("path/file.pdf")).rejects.toThrow("not implemented");
  });

  it("getPublicUrl は 'not implemented' エラーをスローする", () => {
    expect(() => provider.getPublicUrl("path/file.pdf")).toThrow("not implemented");
  });
});

describe("SupabaseStorageProvider", () => {
  const provider = new SupabaseStorageProvider(
    "https://example.supabase.co",
    "service-role-key"
  );

  it("upload が公開 URL を返す", async () => {
    const url = await provider.upload(
      "hojokin-files/test/file.pdf",
      Buffer.from([1, 2, 3]),
      "application/pdf"
    );
    expect(typeof url).toBe("string");
    expect(url.length).toBeGreaterThan(0);
  });

  it("download が Buffer を返す", async () => {
    const data = await provider.download("hojokin-files/test/file.pdf");
    expect(Buffer.isBuffer(data)).toBe(true);
  });

  it("delete が正常に完了する", async () => {
    await expect(
      provider.delete("hojokin-files/test/file.pdf")
    ).resolves.toBeUndefined();
  });

  it("getPublicUrl が文字列を返す", () => {
    const url = provider.getPublicUrl("hojokin-files/test/file.pdf");
    expect(typeof url).toBe("string");
    expect(url.length).toBeGreaterThan(0);
  });
});

describe("getStorageProvider", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
    delete process.env.STORAGE_PROVIDER;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("STORAGE_PROVIDER 未設定で SupabaseStorageProvider を返す", () => {
    const provider = getStorageProvider();
    expect(provider).toBeInstanceOf(SupabaseStorageProvider);
  });

  it("STORAGE_PROVIDER=supabase で SupabaseStorageProvider を返す", () => {
    process.env.STORAGE_PROVIDER = "supabase";
    const provider = getStorageProvider();
    expect(provider).toBeInstanceOf(SupabaseStorageProvider);
  });

  it("STORAGE_PROVIDER=vercel-blob で VercelBlobStorageProvider を返す", () => {
    process.env.STORAGE_PROVIDER = "vercel-blob";
    const provider = getStorageProvider();
    expect(provider).toBeInstanceOf(VercelBlobStorageProvider);
  });

  it("Supabase 環境変数が未設定の場合はエラーをスローする", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(() => getStorageProvider()).toThrow("Supabase 環境変数が未設定");
  });
});
