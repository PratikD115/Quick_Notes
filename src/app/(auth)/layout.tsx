import AuthNavbar from "@/components/AuthNavbar";
import "./../globals.css";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div>
          <AuthNavbar />
        </div>
        {children}
      </body>
    </html>
  );
}
