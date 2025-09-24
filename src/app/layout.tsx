import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AuthWrapper from "@/components/layout/AuthWrapper";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

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
        <AuthWrapper>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AuthWrapper>
      </body>
    </html>
  );
}
