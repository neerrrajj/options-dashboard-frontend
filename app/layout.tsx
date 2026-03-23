import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "optionstrike",
  description: "Options analytics dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${jetbrainsMono.variable} antialiased`}
        style={{ fontFamily: 'var(--font-sans), sans-serif' }}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <TooltipProvider>
              {children}
              <Toaster 
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: '#0d0d0d',
                    border: '1px solid #222',
                    color: '#e8e8e8',
                  },
                }}
              />
            </TooltipProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
