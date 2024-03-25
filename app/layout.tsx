import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
    <>
      <html lang="en">
        <body className={inter.className}>
          <header className="w-full bg-slate-300 p-6">
            <ul className="flex justify-end">
              <li className="mr-6">
                <a
                  className="text-blue-500 text-2xl hover:text-blue-800"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li className="mr-6">
                <a
                  className="text-blue-500 text-2xl hover:text-blue-800"
                  href="/register"
                >
                  Regitster
                </a>
              </li>
              <li className="mr-6">
                <a
                  className="text-blue-500 text-2xl hover:text-blue-800"
                  href="/login"
                >
                  Login in
                </a>
              </li>
            </ul>
          </header>
          {children}
          <footer className="w-full bg-slate-300">Footer</footer>
        </body>
      </html>
    </>
  );
}
