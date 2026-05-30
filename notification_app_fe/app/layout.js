import AppLayout from "./AppLayout";
import "./globals.css";

export const metadata = {
  title: "Campus Notifications",
  description: "View and manage campus hiring notifications",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
