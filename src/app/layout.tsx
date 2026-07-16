import { fontVariables } from "@/lib/styles/fonts";

/**
 * Root layout — bare pass-through.
 *
 * Only provides `<html>` and `<body>` with font variables.
 * All providers, shell components (SiteHeader/SiteFooter), CSS imports,
 * and metadata belong in `app/[locale]/layout.tsx`.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontVariables}>{children}</body>
    </html>
  );
}
