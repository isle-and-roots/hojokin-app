import Link from "next/link";
import { UserCircle, ArrowRight } from "lucide-react";

export function ProfileCTA() {
  return (
    <div className="mb-8 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6">
      <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-4">
        <div className="rounded-full bg-primary/10 p-3">
          <UserCircle className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">
            企業プロフィールを登録して最適な補助金を見つけましょう
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            業種や事業内容を登録すると、AIがあなたの企業に最適な補助金を自動でおすすめします。
            登録は3分で完了します。
          </p>
          <Link
            href="/profile"
            className="mt-3 inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            プロフィールを登録する
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
