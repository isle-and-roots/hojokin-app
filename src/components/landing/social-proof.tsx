import { Users, Quote, Sparkles } from "lucide-react";

interface SocialProofProps {
  stats: {
    userCount: number;
    fullSupportCount: number;
    totalMaxAmount: string;
  };
}

export function SocialProof({ stats }: SocialProofProps) {
  return (
    <section className="py-12 md:py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: User count */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-4">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold mb-1">
              {stats.userCount}+ 人
            </p>
            <p className="text-sm text-muted-foreground">が利用中</p>
          </div>

          {/* Card 2: Anonymous use case */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 mb-4">
              <Quote className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              「持続化補助金の申請書を3分で下書きできました。コンサルタントに頼む前に試す価値があります」
            </p>
            <p className="text-xs text-muted-foreground mt-3">— 製造業・従業員10名</p>
          </div>

          {/* Card 3: Full support count */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mb-4">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold mb-1">
              {stats.fullSupportCount}件
            </p>
            <p className="text-sm text-muted-foreground">AI完全対応の補助金</p>
          </div>
        </div>
      </div>
    </section>
  );
}
