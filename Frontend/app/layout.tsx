import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { verifySession } from "@/api/userAPI";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Photo Manager",
  description: "Gokruzk",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await verifySession();
  console.log(session);

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
