import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Caption Manager",
  description: "Sartiq.ai Coding Challenge",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
