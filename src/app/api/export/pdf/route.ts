import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { trackServerEvent } from "@/lib/posthog/track";
import { EVENTS } from "@/lib/posthog/events";

interface SectionData {
  sectionKey: string;
  sectionTitle: string;
  group?: string;
  content: string;
}

interface CompanyInfo {
  companyName: string;
  representative?: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface ApplicationData {
  subsidyName: string;
  sections: SectionData[];
  companyInfo?: CompanyInfo;
}

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "ログインしてください" },
        { status: 401 }
      );
    }

    // プランチェック（Pro以上のみ）
    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    if (userProfile?.plan === "free") {
      return NextResponse.json(
        { error: "この機能は Pro プラン以上でご利用いただけます。" },
        { status: 403 }
      );
    }

    const body: ApplicationData = await request.json();
    const { subsidyName, sections, companyInfo } = body;

    const { renderToBuffer, Document } = await import("@react-pdf/renderer");
    const { registerFonts } = await import("@/lib/pdf/font-config");
    const { ApplicationPdf } = await import("@/lib/pdf/application-pdf");
    const React = await import("react");

    registerFonts();

    const appElement = React.createElement(ApplicationPdf, {
      subsidyName,
      sections,
      companyInfo,
    });

    // ApplicationPdf renders a Document at its root; cast to satisfy renderToBuffer's type
    const docElement = appElement as unknown as React.ReactElement<
      React.ComponentProps<typeof Document>
    >;

    const buffer = await renderToBuffer(docElement);

    trackServerEvent(user.id, EVENTS.DOCX_EXPORTED, {
      subsidy_name: subsidyName,
      section_count: sections.length,
      format: "pdf",
    });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="hojokin_application.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Export failed" },
      { status: 500 }
    );
  }
}
