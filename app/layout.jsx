import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME } from "../lib/site";

export const metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Facebook JS SDK for WhatsApp Embedded Signup */}
        <script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/en_US/sdk.js"
        />
      </head>
      <body>
        <div className="app-shell">
          {children}
        </div>
      </body>
    </html>
  );
}
