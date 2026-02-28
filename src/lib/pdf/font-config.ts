import { Font } from "@react-pdf/renderer";

const FONT_BASE =
  "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest";

export function registerFonts(): void {
  Font.register({
    family: "NotoSansJP",
    fonts: [
      {
        src: `${FONT_BASE}/japanese-400-normal.ttf`,
        fontWeight: 400,
      },
      {
        src: `${FONT_BASE}/japanese-700-normal.ttf`,
        fontWeight: 700,
      },
    ],
  });
}
