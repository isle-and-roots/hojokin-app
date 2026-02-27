#!/usr/bin/env node
/**
 * PWA icon generator — uses sharp (bundled with Next.js)
 * Run: node scripts/generate-icons.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "icons");
mkdirSync(outDir, { recursive: true });

function createSvg(size) {
  const r = Math.round(size * 0.2); // corner radius
  const fontSize = Math.round(size * 0.5);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#2563eb"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-family="Arial,Helvetica,sans-serif" font-weight="bold"
        font-size="${fontSize}" fill="white">H</text>
</svg>`);
}

const sizes = [
  { name: "icon-192x192.png", size: 192 },
  { name: "icon-512x512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of sizes) {
  const svg = createSvg(size);
  await sharp(svg).png().toFile(join(outDir, name));
  console.log(`✓ ${name} (${size}x${size})`);
}

console.log("Done!");
