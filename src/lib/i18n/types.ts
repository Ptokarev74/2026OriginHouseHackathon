export type AppLanguage = "en" | "es" | "so";
export type CopyLanguage = Exclude<AppLanguage, "so">;

export type LocalizedText = Record<AppLanguage, string>;

export const appLanguages: Array<{
  code: AppLanguage;
  label: string;
  nativeLabel: string;
}> = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "so", label: "Somali", nativeLabel: "Soomaali" },
];

export function isAppLanguage(value: string | null): value is AppLanguage {
  return value === "en" || value === "es" || value === "so";
}

export function copyLanguage(language: AppLanguage): CopyLanguage {
  return language === "es" ? "es" : "en";
}
