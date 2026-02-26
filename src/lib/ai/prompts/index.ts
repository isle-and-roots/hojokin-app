import { getJizokukaPrompt } from "./jizokuka";
import { getItDonyuPrompt } from "./it-donyu";
import { getMonodzukuriPrompt } from "./monodzukuri";
import { getShouryokukaPrompt } from "./shouryokuka";
import { getShinjiyoShinshutsuPrompt } from "./shinjigyo-shinshutsu";
import { getSeichouKasokukaPrompt } from "./seichou-kasokuka";
import { getGenericPrompt } from "./generic";
import type { BusinessProfile, SubsidyInfo } from "@/types";

export function getPrompt(
  subsidy: SubsidyInfo,
  sectionKey: string,
  profile: BusinessProfile,
  additionalContext?: string
): string {
  if (subsidy.subsidyType === "JIZOKUKA" && subsidy.promptSupport === "FULL") {
    return getJizokukaPrompt(sectionKey, profile, additionalContext);
  }

  if (subsidy.subsidyType === "IT_DONYU" && subsidy.promptSupport === "FULL") {
    return getItDonyuPrompt(subsidy.id, sectionKey, profile, additionalContext);
  }

  if (subsidy.subsidyType === "MONODZUKURI" && subsidy.promptSupport === "FULL") {
    return getMonodzukuriPrompt(sectionKey, profile, additionalContext);
  }

  if (subsidy.subsidyType === "SHOURYOKUKA" && subsidy.promptSupport === "FULL") {
    return getShouryokukaPrompt(sectionKey, profile, additionalContext);
  }

  if (subsidy.subsidyType === "SHINJIGYO_SHINSHUTSU" && subsidy.promptSupport === "FULL") {
    return getShinjiyoShinshutsuPrompt(sectionKey, profile, additionalContext);
  }

  if (subsidy.subsidyType === "SEICHOU_KASOKUKA" && subsidy.promptSupport === "FULL") {
    return getSeichouKasokukaPrompt(sectionKey, profile, additionalContext);
  }

  const sectionDef = subsidy.applicationSections.find(
    (s) => s.key === sectionKey
  );
  if (!sectionDef) {
    throw new Error(
      `Unknown section key "${sectionKey}" for subsidy "${subsidy.name}"`
    );
  }
  return getGenericPrompt(subsidy, sectionDef, profile, additionalContext);
}
