import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Athena - Personal Growth Platform",
  description: "A Greek-themed personalized self-improvement platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-temple">
        <nav className="bg-white shadow-lg border-b-4 border-gold-400">
          <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex justify-between h-20">
              <div className="flex items-center">
                <h1 className="text-3xl font-serif font-bold text-primary-700">
                  Athena
                </h1>
              </div>
              <div className="flex space-x-8 items-center gap-8">
                <a href="/dashboard" className="text-base font-serif font-bold text-green-700 hover:text-white hover:underline px-4 py-3 rounded-md bg-white hover:bg-green-700 transition-all duration-200">
                  Dashboard
                </a>
                <a href="/chat" className="text-base font-serif font-bold text-green-700 hover:text-white hover:underline px-4 py-3 rounded-md bg-white hover:bg-green-700 transition-all duration-200">
                  Ask Athena
                </a>
                <a href="/pomodoro" className="text-base font-serif font-bold text-green-700 hover:text-white hover:underline px-4 py-3 rounded-md bg-white hover:bg-green-700 transition-all duration-200">
                  Pomodoro
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}