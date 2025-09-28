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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-serif font-bold text-primary-700">
                  ΑΘΗΝΑ
                </h1>
              </div>
              <div className="flex space-x-6 items-center gap-6">
                <a href="/dashboard" className="text-sm font-serif font-bold text-green-700 hover:underline px-3 py-2 rounded-md bg-gray-50 hover:bg-gray-100 transition">
                  Dashboard
                </a>
                <a href="/chat" className="text-sm font-serif font-bold text-green-700 hover:underline px-3 py-2 rounded-md bg-gray-50 hover:bg-gray-100 transition">
                  Ask Athena
                </a>
                <a href="/pomodoro" className="text-sm font-serif font-bold text-green-700 hover:underline px-3 py-2 rounded-md bg-gray-50 hover:bg-gray-100 transition">
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