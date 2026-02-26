import { describe, it, expect } from "vitest";
import { searchSubsidies, getSubsidyById } from "@/lib/subsidies";

describe("searchSubsidies", () => {
  it("returns all subsidies when no filters", async () => {
    const result = await searchSubsidies({});
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.total).toBe(result.items.length);
  });

  it("filters by keyword", async () => {
    const result = await searchSubsidies({ keyword: "持続化" });
    expect(result.items.length).toBeGreaterThan(0);
    result.items.forEach((item) => {
      const text = `${item.name} ${item.nameShort} ${item.summary} ${item.tags.join(" ")} ${item.department}`;
      expect(text).toContain("持続化");
    });
  });

  it("filters by category", async () => {
    const result = await searchSubsidies({ categories: ["IT_DIGITAL"] });
    expect(result.items.length).toBeGreaterThan(0);
    result.items.forEach((item) => {
      expect(item.categories).toContain("IT_DIGITAL");
    });
  });

  it("filters by prompt support", async () => {
    const result = await searchSubsidies({ promptSupport: ["FULL"] });
    expect(result.items.length).toBeGreaterThan(0);
    result.items.forEach((item) => {
      expect(item.promptSupport).toBe("FULL");
    });
  });

  it("filters by difficulty", async () => {
    const result = await searchSubsidies({ difficulty: ["EASY"] });
    result.items.forEach((item) => {
      expect(item.difficulty).toBe("EASY");
    });
  });
});

describe("getSubsidyById", () => {
  it("returns a subsidy by id", async () => {
    const subsidy = await getSubsidyById("jizokuka-001");
    expect(subsidy).not.toBeNull();
    expect(subsidy?.id).toBe("jizokuka-001");
    expect(subsidy?.promptSupport).toBe("FULL");
  });

  it("returns null for unknown id", async () => {
    const subsidy = await getSubsidyById("nonexistent-id");
    expect(subsidy).toBeNull();
  });
});
