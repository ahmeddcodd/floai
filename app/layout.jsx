import "./globals.css";

export const metadata = {
  title: "FloAI Dashboard",
  description: "Register your store and monitor COD orders in real time.",
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
