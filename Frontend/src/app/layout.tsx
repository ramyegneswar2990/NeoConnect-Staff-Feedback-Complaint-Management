import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeoConnect - Staff Feedback & Complaint Management",
  description: "Secure platform for staff to submit complaints and track resolutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} temple-night-bg`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
