import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import BottomNavigation from "@/components/layout/BottomNavigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "House Flipping Dashboard",
  description: "Dashboard moderno para gestão e análise de investimentos imobiliários em house flipping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased bg-white`}>
        <div className="flex h-screen">
          {/* Desktop Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto md:overflow-auto pb-16 md:pb-0">
            {children}
          </main>
        </div>
        
        {/* Mobile Bottom Navigation */}
        <BottomNavigation />
      </body>
    </html>
  );
}
