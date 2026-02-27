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

interface ApplicationData {
  subsidyName: string;
  sections: SectionData[];
}

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

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
    const { subsidyName, sections } = body;

    const {
      Document,
      Packer,
      Paragraph,
      TextRun,
      HeadingLevel,
      AlignmentType,
      BorderStyle,
    } = await import("docx");

    const allChildren: InstanceType<typeof Paragraph>[] = [];

    // Group sections by their group field
    const groups: Record<string, SectionData[]> = {};
    for (const section of sections) {
      const g = section.group || "default";
      if (!groups[g]) groups[g] = [];
      groups[g].push(section);
    }

    const groupEntries = Object.entries(groups);

    for (let gi = 0; gi < groupEntries.length; gi++) {
      const [groupName, groupSections] = groupEntries[gi];

      // Page break between groups (not before the first)
      if (gi > 0) {
        allChildren.push(
          new Paragraph({
            text: "",
            pageBreakBefore: true,
          })
        );
      }

      // Group title
      allChildren.push(
        new Paragraph({
          text: groupName === "default" ? subsidyName : groupName,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );

      for (const section of groupSections) {
        allChildren.push(
          new Paragraph({
            text: section.sectionTitle,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            border: {
              bottom: {
                style: BorderStyle.SINGLE,
                size: 1,
                color: "999999",
              },
            },
          })
        );
        const paragraphs = section.content.split("\n").filter((p) => p.trim());
        for (const para of paragraphs) {
          allChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: para, size: 21, font: "MS Mincho" }),
              ],
              spacing: { after: 120 },
            })
          );
        }
      }
    }

    const doc = new Document({
      sections: [{ children: allChildren }],
    });

    const buffer = await Packer.toBuffer(doc);

    trackServerEvent(user.id, EVENTS.DOCX_EXPORTED, {
      subsidy_name: subsidyName,
      section_count: sections.length,
    });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="hojokin_application.docx"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Export failed" },
      { status: 500 }
    );
  }
}
