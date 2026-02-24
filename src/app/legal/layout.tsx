import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            トップに戻る
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-12">{children}</main>
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>&copy; {new Date().getFullYear()} ISLE &amp; ROOTS</span>
            <div className="flex gap-4">
              <Link
                href="/legal/tokushoho"
                className="hover:text-foreground transition-colors"
              >
                特定商取引法に基づく表記
              </Link>
              <Link
                href="/legal/terms"
                className="hover:text-foreground transition-colors"
              >
                利用規約
              </Link>
              <Link
                href="/legal/privacy"
                className="hover:text-foreground transition-colors"
              >
                プライバシーポリシー
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
