import type { AbstractIntlMessages } from "next-intl";
import { type Locale } from "./routing";

// Static imports — deliberately NOT computed dynamic `import()` — so this
// module works in client/browser bundlers (Storybook/Vite) that cannot
// resolve computed dynamic import paths. The server keeps its own lazy
// dynamic-import variant in `request.ts`; the two MUST stay in sync.
import baseEn from "../../messages/base/en.json";
import baseDa from "../../messages/base/da.json";
import customEn from "../../messages/custom/en.json";
import customDa from "../../messages/custom/da.json";

/**
 * All locales' messages, merged with the same shallow-spread semantics as
 * `createRequestConfig` in `request.ts`: `{ ...base, ...custom }` — top-level
 * custom keys fully replace matching base keys.
 *
 * This is the client-safe message source (used by Storybook and tests).
 * Adding a locale requires three coordinated edits:
 *
 *   1. `routing.ts` — add the locale to `locales`
 *   2. `messages/{base,custom}/{locale}.json` — create the message files
 *   3. here — add the two static imports and one map entry
 */
const messagesByLocale = {
  en: { ...baseEn, ...customEn },
  da: { ...baseDa, ...customDa },
} satisfies Record<Locale, AbstractIntlMessages>;

/** Inferred, keyed message shape shared by every locale. */
export type Messages = (typeof messagesByLocale)[Locale];

/** Client-safe merged messages for a single locale. */
export function getMessagesForLocale(locale: Locale): Messages {
  return messagesByLocale[locale];
}
