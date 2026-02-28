import { describe, it, expect } from "vitest";
import { computeDiff, compareSections } from "@/lib/reports/diff";

describe("computeDiff", () => {
  it("完全一致の場合は類似度100、変更なし", () => {
    const text = "これは同じテキストです。";
    const result = computeDiff(text, text);
    expect(result.similarity).toBe(100);
    expect(result.stats.inserted).toBe(0);
    expect(result.stats.deleted).toBe(0);
    expect(result.changes.every((c) => c.type === "equal")).toBe(true);
  });

  it("空文字列同士は類似度100", () => {
    const result = computeDiff("", "");
    expect(result.similarity).toBe(100);
    expect(result.stats.totalOld).toBe(0);
    expect(result.stats.totalNew).toBe(0);
  });

  it("全く異なるテキストは類似度が低い", () => {
    const result = computeDiff("旧テキスト内容", "新しい別の文章");
    expect(result.similarity).toBeLessThan(50);
  });

  it("挿入されたテキストがinsertとして検出される", () => {
    const oldText = "これはテストです。";
    const newText = "これは重要なテストです。";
    const result = computeDiff(oldText, newText);
    const insertedChanges = result.changes.filter((c) => c.type === "insert");
    expect(insertedChanges.length).toBeGreaterThan(0);
    expect(result.stats.inserted).toBeGreaterThan(0);
  });

  it("削除されたテキストがdeleteとして検出される", () => {
    const oldText = "これは重要なテストです。";
    const newText = "これはテストです。";
    const result = computeDiff(oldText, newText);
    const deletedChanges = result.changes.filter((c) => c.type === "delete");
    expect(deletedChanges.length).toBeGreaterThan(0);
    expect(result.stats.deleted).toBeGreaterThan(0);
  });

  it("変更のないテキストはequalとして保持される", () => {
    const oldText = "共通部分があります。変更された部分です。";
    const newText = "共通部分があります。別の内容です。";
    const result = computeDiff(oldText, newText);
    const equalChanges = result.changes.filter((c) => c.type === "equal");
    expect(equalChanges.length).toBeGreaterThan(0);
  });

  it("similarityは0-100の範囲内", () => {
    const result = computeDiff("あいうえお", "かきくけこ");
    expect(result.similarity).toBeGreaterThanOrEqual(0);
    expect(result.similarity).toBeLessThanOrEqual(100);
  });

  it("statsのtotalOldとtotalNewが正しい", () => {
    const oldText = "テスト用テキスト";
    const newText = "新しいテスト用テキスト追加";
    const result = computeDiff(oldText, newText);
    expect(result.stats.totalOld).toBeGreaterThan(0);
    expect(result.stats.totalNew).toBeGreaterThanOrEqual(result.stats.totalOld);
  });

  it("英語テキストの差分も正しく検出する", () => {
    const oldText = "Hello world test";
    const newText = "Hello beautiful world";
    const result = computeDiff(oldText, newText);
    expect(result.stats.inserted).toBeGreaterThan(0);
    expect(result.stats.deleted).toBeGreaterThan(0);
    expect(result.similarity).toBeGreaterThan(0);
    expect(result.similarity).toBeLessThan(100);
  });

  it("日本語の詳細な差分テスト", () => {
    const oldText = "当社の強みは地域密着型サービスです。";
    const newText = "当社の強みは地域密着型サービスと独自技術です。";
    const result = computeDiff(oldText, newText);
    // 新しいテキストに「と独自技術」が追加されている
    const hasInsert = result.changes.some(
      (c) => c.type === "insert" && c.value.includes("独自")
    );
    expect(hasInsert).toBe(true);
  });

  it("changesを結合するとoriginalの内容が再現できる（旧テキスト）", () => {
    const oldText = "これはテストの文章です。変更される部分があります。";
    const newText = "これはサンプルの文章です。変更された内容があります。";
    const result = computeDiff(oldText, newText);

    const reconstructedOld = result.changes
      .filter((c) => c.type !== "insert")
      .map((c) => c.value)
      .join("");

    expect(reconstructedOld).toBe(oldText);
  });

  it("changesを結合するとnewTextが再現できる（新テキスト）", () => {
    const oldText = "これはテストの文章です。変更される部分があります。";
    const newText = "これはサンプルの文章です。変更された内容があります。";
    const result = computeDiff(oldText, newText);

    const reconstructedNew = result.changes
      .filter((c) => c.type !== "delete")
      .map((c) => c.value)
      .join("");

    expect(reconstructedNew).toBe(newText);
  });
});

describe("compareSections", () => {
  it("セクション情報を含むDiffResultを返す", () => {
    const result = compareSections(
      "旧コンテンツ",
      "新コンテンツ",
      "company_overview",
      "1. 企業概要"
    );
    expect(result.sectionKey).toBe("company_overview");
    expect(result.sectionTitle).toBe("1. 企業概要");
    expect(result.diff).toBeDefined();
    expect(result.diff.similarity).toBeGreaterThanOrEqual(0);
  });

  it("同じコンテンツは類似度100を返す", () => {
    const content = "変更のないコンテンツです。";
    const result = compareSections(
      content,
      content,
      "strengths",
      "3. 強み"
    );
    expect(result.diff.similarity).toBe(100);
  });
});
