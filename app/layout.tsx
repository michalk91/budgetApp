import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Providers } from "./Providers";
import Wrapper from "./components/Wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BudgetApp",
  description: "No description yet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} `}>
        <Providers>
          <Header />
          <Wrapper>
            <main className="overflow-hidden pt-24 px-24 max-md:px-10">{children}</main>
          </Wrapper>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
