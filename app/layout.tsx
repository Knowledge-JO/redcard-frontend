import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import I18n from "./I18n";
import { PublicProvider } from "@/context/PublicProvider";
import ProtectedRoute from "./ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";
import ReactQuery from "./ReactQuery";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Redcards",
  description: "Redcards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQuery>
          <PublicProvider>
            <ProtectedRoute>
              <I18n>{children}</I18n>
              <Toaster />
            </ProtectedRoute>
          </PublicProvider>
        </ReactQuery>
      </body>
    </html>
  );
}
