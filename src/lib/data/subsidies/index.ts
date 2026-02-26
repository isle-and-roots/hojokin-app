import type { SubsidyInfo } from "@/types";

// カテゴリ別データのインポート
import { hanbaiKaikakuSubsidies } from "./hanbai-kaikaku";
import { itDigitalSubsidies } from "./it-digital";
import { setsubiToushiSubsidies } from "./setsubi-toushi";
import { kenkyuuKaihatsuSubsidies } from "./kenkyuu-kaihatsu";
import { jinzaiIkuseiSubsidies } from "./jinzai-ikusei";
import { chiikiKasseikaSubsidies } from "./chiiki-kasseika";
import { souzouTenkanSubsidies } from "./souzou-tenkan";
import { kankyouEnergySubsidies } from "./kankyou-energy";
import { otherSubsidies } from "./other";
import { shouryokukaSubsidies } from "./shouryokuka";
import { shinjiyoShinshutsuSubsidies } from "./shinjigyo-shinshutsu";
import { seichouKasokukaSubsidies } from "./seichou-kasokuka";

/**
 * 全補助金データの統合配列
 * 全カテゴリから集約した補助金情報
 */
export const ALL_SUBSIDIES: SubsidyInfo[] = [
  ...hanbaiKaikakuSubsidies,
  ...itDigitalSubsidies,
  ...setsubiToushiSubsidies,
  ...kenkyuuKaihatsuSubsidies,
  ...jinzaiIkuseiSubsidies,
  ...chiikiKasseikaSubsidies,
  ...souzouTenkanSubsidies,
  ...kankyouEnergySubsidies,
  ...otherSubsidies,
  ...shouryokukaSubsidies,
  ...shinjiyoShinshutsuSubsidies,
  ...seichouKasokukaSubsidies,
];

// 後方互換性のため DUMMY_SUBSIDIES としてもエクスポート
export const DUMMY_SUBSIDIES = ALL_SUBSIDIES;

// カテゴリ別エクスポート（個別利用向け）
export {
  hanbaiKaikakuSubsidies,
  itDigitalSubsidies,
  setsubiToushiSubsidies,
  kenkyuuKaihatsuSubsidies,
  jinzaiIkuseiSubsidies,
  chiikiKasseikaSubsidies,
  souzouTenkanSubsidies,
  kankyouEnergySubsidies,
  otherSubsidies,
  shouryokukaSubsidies,
  shinjiyoShinshutsuSubsidies,
  seichouKasokukaSubsidies,
};
