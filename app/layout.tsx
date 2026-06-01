import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { AppShellWrapper } from "@/components/layout/app-shell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Industrial Attendance & Shift Management",
  description: "Enterprise-level AI-powered workforce attendance management system for 320+ industrial workers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <AppShellWrapper>
            {children}
          </AppShellWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
