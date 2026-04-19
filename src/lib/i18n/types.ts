export type AppLanguage = "en" | "es" | "so" | "fr";
export type CopyLanguage = Exclude<AppLanguage, "fr">;

export type LocalizedText = Record<AppLanguage, string>;

export const appLanguages: Array<{
  code: AppLanguage;
  label: string;
  nativeLabel: string;
}> = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "so", label: "Somali", nativeLabel: "Soomaali" },
  { code: "fr", label: "French", nativeLabel: "Français" },
];

export function isAppLanguage(value: string | null): value is AppLanguage {
  return value === "en" || value === "es" || value === "so" || value === "fr";
}

export function copyLanguage(language: AppLanguage): CopyLanguage {
  if (language === "es" || language === "so") {
    return language;
  }

  return "en";
}
