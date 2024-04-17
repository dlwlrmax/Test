import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { LayoutProvider } from "./LayoutProvider";
import { AuthProvider } from "@/Contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HBR Test",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="h-screen text-gray-900 flex items-center justify-center w-screen bg-gray-950">
          <AuthProvider>
            <LayoutProvider>{children}</LayoutProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
