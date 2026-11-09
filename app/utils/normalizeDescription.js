// app/utils/normalizeDescription.js

export function normalizeDescription(desc = "") {
  if (!desc || typeof desc !== "string") {
    return { en: "", zh: "" };
  }

  // Extract the Chinese content within the brackets (display elsewhere if required)
  const zh = desc.match(/\((.*?)\)/)?.[1]?.trim() || "";

  // Remove the brackets + content + any superfluous spaces on either side
  const en = desc
    .replace(/\(.*?\)/, "")   // Remove (……)
    .replace(/（.*?）/, "")   // Compatible with Chinese parentheses (……)
    .trim();

  return {
    en,
    zh,
  };
}

