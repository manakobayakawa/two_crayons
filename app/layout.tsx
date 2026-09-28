import type { Metadata, Viewport } from "next";
import "@fontsource/gochi-hand/400.css";
import "@fontsource/patrick-hand/400.css";
import "@fontsource/chewy/400.css";
import "@fontsource/fredoka/400.css";
import "@fontsource/fredoka/500.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/yusei-magic/400.css";
import "@fontsource/klee-one/400.css";
import "@fontsource/klee-one/600.css";
import "@fontsource/kiwi-maru/400.css";
import "@fontsource/kiwi-maru/500.css";
import "@fontsource/hachi-maru-pop/400.css";
import "@fontsource/zen-maru-gothic/500.css";
import "@fontsource/zen-maru-gothic/700.css";
import "./globals.css";
import { CrayonDefs } from "@/assets/crayon";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Two Crayons — a picture book for two",
  description: "Make a crayon picture book together, live, from anywhere.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6efe0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CrayonDefs />
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
