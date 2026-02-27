import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.scss";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import Navigation from "@/components/navigation/Navigation";
import AuthGuard from "@/components/auth/AuthGuard";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Weekly Planner",
  description: "Weekly calendar, meal, and workout planning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body>
        <AuthProvider>
          <AuthGuard>
            <ProfileProvider>
              <Navigation />
              <main>{children}</main>
            </ProfileProvider>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
