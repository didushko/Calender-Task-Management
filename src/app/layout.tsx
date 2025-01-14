import type { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "../../lib/registry";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Calendar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster toastOptions={{ duration: 3000, position: "bottom-right" }} />
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
