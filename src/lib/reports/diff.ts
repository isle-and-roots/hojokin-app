// === 差分タイプ ===
export type DiffChangeType = "equal" | "insert" | "delete";

export interface DiffChange {
  type: DiffChangeType;
  value: string;
}

export interface DiffStats {
  inserted: number; // 追加単語数
  deleted: number; // 削除単語数
  unchanged: number; // 変更なし単語数
  totalOld: number; // 旧バージョンの総単語数
  totalNew: number; // 新バージョンの総単語数
}

export interface DiffResult {
  changes: DiffChange[];
  stats: DiffStats;
  similarity: number; // 0-100 (100=完全一致)
}

// === テキストをトークンに分割 ===
// 日本語は文字単位、英数字は単語単位で分割
function tokenize(text: string): string[] {
  const tokens: string[] = [];
  let current = "";

  for (const char of text) {
    const isAsciiWord = /[a-zA-Z0-9]/.test(char);
    const isPrevAsciiWord = current.length > 0 && /[a-zA-Z0-9]/.test(current[current.length - 1]);

    if (isAsciiWord && isPrevAsciiWord) {
      // 連続する英数字はひとまとめ
      current += char;
    } else {
      if (current.length > 0) {
        tokens.push(current);
      }
      current = char;
    }
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}

// === LCS (Longest Common Subsequence) による差分計算 ===
// ワードベースの差分アルゴリズム（外部依存なし）
function computeLCS(oldTokens: string[], newTokens: string[]): number[][] {
  const m = oldTokens.length;
  const n = newTokens.length;

  // DPテーブル（メモリ効率のため2行のみ保持）
  let prev = new Array<number>(n + 1).fill(0);
  let curr = new Array<number>(n + 1).fill(0);

  // LCS長の全テーブルが必要なのでフルテーブルを作成
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldTokens[i - 1] === newTokens[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // LCSは使うが変数への代入を消すため
  void prev;
  void curr;

  return dp;
}

// === バックトレースで差分を構築 ===
function buildDiff(
  oldTokens: string[],
  newTokens: string[],
  dp: number[][]
): DiffChange[] {
  const changes: DiffChange[] = [];
  let i = oldTokens.length;
  let j = newTokens.length;
  const rawChanges: DiffChange[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldTokens[i - 1] === newTokens[j - 1]) {
      rawChanges.push({ type: "equal", value: oldTokens[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawChanges.push({ type: "insert", value: newTokens[j - 1] });
      j--;
    } else {
      rawChanges.push({ type: "delete", value: oldTokens[i - 1] });
      i--;
    }
  }

  // 逆順なので戻す
  rawChanges.reverse();

  // 同じタイプの連続したchangeをマージ
  for (const change of rawChanges) {
    if (changes.length > 0 && changes[changes.length - 1].type === change.type) {
      changes[changes.length - 1] = {
        type: change.type,
        value: changes[changes.length - 1].value + change.value,
      };
    } else {
      changes.push({ ...change });
    }
  }

  return changes;
}

// === 統計情報の計算 ===
function calcStats(oldTokens: string[], newTokens: string[], changes: DiffChange[]): DiffStats {
  let inserted = 0;
  let deleted = 0;
  let unchanged = 0;

  for (const change of changes) {
    // 空白以外のトークン数でカウント
    const tokenCount = change.value.split(/\s+/).filter((t) => t.length > 0).length || 1;
    if (change.type === "insert") inserted += tokenCount;
    else if (change.type === "delete") deleted += tokenCount;
    else unchanged += tokenCount;
  }

  return {
    inserted,
    deleted,
    unchanged,
    totalOld: oldTokens.length,
    totalNew: newTokens.length,
  };
}

// === 類似度計算 ===
function calcSimilarity(stats: DiffStats): number {
  const total = stats.totalOld + stats.totalNew;
  if (total === 0) return 100;
  const similarity = (2 * stats.unchanged) / total;
  return Math.round(similarity * 100);
}

// === メイン差分関数 ===
export function computeDiff(oldText: string, newText: string): DiffResult {
  if (oldText === newText) {
    const tokens = tokenize(oldText);
    const stats: DiffStats = {
      inserted: 0,
      deleted: 0,
      unchanged: tokens.length,
      totalOld: tokens.length,
      totalNew: tokens.length,
    };
    return {
      changes: oldText.length > 0 ? [{ type: "equal", value: oldText }] : [],
      stats,
      similarity: 100,
    };
  }

  const oldTokens = tokenize(oldText);
  const newTokens = tokenize(newText);

  const dp = computeLCS(oldTokens, newTokens);
  const changes = buildDiff(oldTokens, newTokens, dp);
  const stats = calcStats(oldTokens, newTokens, changes);
  const similarity = calcSimilarity(stats);

  return { changes, stats, similarity };
}

// === セクション差分ヘルパー ===
export interface SectionDiff {
  sectionKey: string;
  sectionTitle: string;
  diff: DiffResult;
}

export function compareSections(
  oldContent: string,
  newContent: string,
  sectionKey: string,
  sectionTitle: string
): SectionDiff {
  return {
    sectionKey,
    sectionTitle,
    diff: computeDiff(oldContent, newContent),
  };
}
