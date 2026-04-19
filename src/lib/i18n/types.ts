export type AppLanguage = "en" | "es";

export type LocalizedText = Record<AppLanguage, string>;

export const appLanguages: Array<{
  code: AppLanguage;
  label: string;
  nativeLabel: string;
}> = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
];

export function isAppLanguage(value: string | null): value is AppLanguage {
  return value === "en" || value === "es";
}
