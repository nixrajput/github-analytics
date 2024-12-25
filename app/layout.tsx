import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GitHub Analytics Dashboard",
  description: "Visualize detailed GitHub statistics for any user",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Suspense
            fallback={<Loader2 className="w-8 h-8 animate-spin text-primary" />}
          >
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
