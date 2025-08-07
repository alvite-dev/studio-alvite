import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Studio Alvite - CRM",
  description: "CRM turbinado para Studio Alvite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased bg-white`}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-72 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
