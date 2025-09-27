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
              <div className="flex space-x-8 items-center">
                <a href="/dashboard" className="text-primary-600 hover:text-primary-800 font-medium">
                  Dashboard
                </a>
                <a href="/profile" className="text-primary-600 hover:text-primary-800 font-medium">
                  Profile
                </a>
                <a href="/chat" className="text-primary-600 hover:text-primary-800 font-medium">
                  Ask Athena
                </a>
                <a href="/pomodoro" className="text-primary-600 hover:text-primary-800 font-medium">
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