import React from "react";
import {
  Document,
  Page,
  View,
  Text,
} from "@react-pdf/renderer";
import { pdfStyles } from "./styles";

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

interface ApplicationPdfProps {
  subsidyName: string;
  sections: SectionData[];
  companyInfo?: CompanyInfo;
}

function CoverPage({
  subsidyName,
  companyInfo,
}: {
  subsidyName: string;
  companyInfo?: CompanyInfo;
}) {
  return (
    <Page size="A4" style={pdfStyles.coverPage}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={pdfStyles.coverTitle}>{subsidyName}</Text>
        <Text style={pdfStyles.coverSubtitle}>補助金申請書類</Text>
        {companyInfo && (
          <View style={pdfStyles.coverCompanyBlock}>
            {companyInfo.companyName && (
              <View>
                <Text style={pdfStyles.coverLabel}>事業者名</Text>
                <Text style={pdfStyles.coverValue}>
                  {companyInfo.companyName}
                </Text>
              </View>
            )}
            {companyInfo.representative && (
              <View>
                <Text style={pdfStyles.coverLabel}>代表者名</Text>
                <Text style={pdfStyles.coverValue}>
                  {companyInfo.representative}
                </Text>
              </View>
            )}
            {companyInfo.address && (
              <View>
                <Text style={pdfStyles.coverLabel}>所在地</Text>
                <Text style={pdfStyles.coverValue}>{companyInfo.address}</Text>
              </View>
            )}
            {companyInfo.phone && (
              <View>
                <Text style={pdfStyles.coverLabel}>電話番号</Text>
                <Text style={pdfStyles.coverValue}>{companyInfo.phone}</Text>
              </View>
            )}
            {companyInfo.email && (
              <View>
                <Text style={pdfStyles.coverLabel}>メールアドレス</Text>
                <Text style={pdfStyles.coverValue}>{companyInfo.email}</Text>
              </View>
            )}
          </View>
        )}
      </View>
      <Text style={pdfStyles.footer} fixed>
        補助金サポート — AI申請書作成システム
      </Text>
    </Page>
  );
}

function ContentPage({
  sections,
  subsidyName,
}: {
  sections: SectionData[];
  subsidyName: string;
}) {
  return (
    <Page size="A4" style={pdfStyles.page}>
      <View>
        {sections.map((section) => {
          const paragraphs = section.content
            .split("\n")
            .filter((p) => p.trim().length > 0);
          return (
            <View key={section.sectionKey} wrap={false}>
              <Text style={pdfStyles.sectionHeader}>
                {section.sectionTitle}
              </Text>
              {paragraphs.map((para, idx) => (
                <Text key={idx} style={pdfStyles.bodyText}>
                  {para}
                </Text>
              ))}
            </View>
          );
        })}
      </View>
      <Text
        style={pdfStyles.footer}
        fixed
        render={({ pageNumber, totalPages }) =>
          `${subsidyName}　${pageNumber} / ${totalPages}`
        }
      />
    </Page>
  );
}

export function ApplicationPdf({
  subsidyName,
  sections,
  companyInfo,
}: ApplicationPdfProps) {
  // Group sections by their group field
  const groups: Record<string, SectionData[]> = {};
  for (const section of sections) {
    const g = section.group ?? "default";
    if (!groups[g]) groups[g] = [];
    groups[g].push(section);
  }

  const groupEntries = Object.entries(groups);

  return (
    <Document
      title={subsidyName}
      author={companyInfo?.companyName ?? ""}
      creator="補助金サポート"
    >
      <CoverPage subsidyName={subsidyName} companyInfo={companyInfo} />
      {groupEntries.map(([, groupSections]) => (
        <ContentPage
          key={groupSections[0].sectionKey}
          sections={groupSections}
          subsidyName={subsidyName}
        />
      ))}
    </Document>
  );
}
