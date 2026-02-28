import { createClient } from "@supabase/supabase-js";

// Default bucket name used when no bucket is embedded in the path
const DEFAULT_BUCKET = "hojokin-files";

export interface StorageProvider {
  upload(path: string, data: Buffer, contentType: string): Promise<string>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
  getPublicUrl(path: string): string;
}

/**
 * Split a path like "my-bucket/folder/file.pdf" into { bucket, filePath }.
 * Falls back to DEFAULT_BUCKET when the path contains no bucket prefix.
 */
function splitPath(path: string): { bucket: string; filePath: string } {
  const idx = path.indexOf("/");
  if (idx === -1) {
    return { bucket: DEFAULT_BUCKET, filePath: path };
  }
  return { bucket: path.slice(0, idx), filePath: path.slice(idx + 1) };
}

export class SupabaseStorageProvider implements StorageProvider {
  private client: ReturnType<typeof createClient>;

  constructor(url: string, key: string) {
    this.client = createClient(url, key);
  }

  async upload(path: string, data: Buffer, contentType: string): Promise<string> {
    const { bucket, filePath } = splitPath(path);
    const { error } = await this.client.storage
      .from(bucket)
      .upload(filePath, data, { contentType, upsert: true });

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    return this.getPublicUrl(path);
  }

  async download(path: string): Promise<Buffer> {
    const { bucket, filePath } = splitPath(path);
    const { data, error } = await this.client.storage.from(bucket).download(filePath);

    if (error || !data) {
      throw new Error(`Storage download failed: ${error?.message ?? "no data"}`);
    }

    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async delete(path: string): Promise<void> {
    const { bucket, filePath } = splitPath(path);
    const { error } = await this.client.storage.from(bucket).remove([filePath]);

    if (error) {
      throw new Error(`Storage delete failed: ${error.message}`);
    }
  }

  getPublicUrl(path: string): string {
    const { bucket, filePath } = splitPath(path);
    const { data } = this.client.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  }
}

export class VercelBlobStorageProvider implements StorageProvider {
  async upload(_path: string, _data: Buffer, _contentType: string): Promise<string> {
    throw new Error("VercelBlobStorageProvider: not implemented");
  }

  async download(_path: string): Promise<Buffer> {
    throw new Error("VercelBlobStorageProvider: not implemented");
  }

  async delete(_path: string): Promise<void> {
    throw new Error("VercelBlobStorageProvider: not implemented");
  }

  getPublicUrl(_path: string): string {
    throw new Error("VercelBlobStorageProvider: not implemented");
  }
}

export function getStorageProvider(): StorageProvider {
  const providerType = process.env.STORAGE_PROVIDER ?? "supabase";

  if (providerType === "vercel-blob") {
    return new VercelBlobStorageProvider();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase 環境変数が未設定: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return new SupabaseStorageProvider(url, key);
}
