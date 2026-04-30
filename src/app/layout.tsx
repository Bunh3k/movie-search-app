import "./globals.css";
import AppTabs from "@/components/AppTabs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>
          <div className="page-header">
            <AppTabs />
          </div>

          {children}
        </main>
      </body>
    </html>
  );
}
