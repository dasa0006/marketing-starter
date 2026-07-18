import { fontVariables } from "@/lib/styles/fonts";
import { ThemeProvider } from "next-themes";

/**
 * Root layout — HTML shell, font variables, and persistent providers.
 *
 * `ThemeProvider` lives here (not in `[locale]/layout.tsx`) so it mounts
 * once and never remounts on client-side navigations, including locale
 * switches. This prevents React 19 from warning about the inline
 * `<script>` element next-themes renders for FOUC prevention — the
 * script only exists during SSR hydration; client-side remounts would
 * trigger a false-positive console error in Next.js 16.2+ (the script
 * is harmless and idempotent on re-creation).
 *
 * All other providers and shell components belong in the locale layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontVariables}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
