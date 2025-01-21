import type { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "../../lib/registry";
import { Toaster } from "react-hot-toast";
import { Open_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Calendar",
};

const bodoniModa = Open_Sans({
  subsets: ["latin"],
  display: "auto",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={bodoniModa.className}>
      <body>
        <Toaster toastOptions={{ duration: 3000, position: "bottom-right" }} />
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
