import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { ToastContainer } from "@/components/ui/ToastContainer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "OtoNav | Vendor Portal",
  description: "Manage your deliveries and riders with OtoNav",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        <ClientLayout>
          {children}
          <ToastContainer />
        </ClientLayout>
      </body>
    </html>
  );
}
