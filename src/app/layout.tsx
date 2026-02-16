import type { Metadata } from "next";
import "./globals.scss";
import { ProfileProvider } from "@/contexts/ProfileContext";
import Navigation from "@/components/navigation/Navigation";

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
    <html lang="en">
      <body>
        <ProfileProvider>
          <Navigation />
          <main>{children}</main>
        </ProfileProvider>
      </body>
    </html>
  );
}
