import "./globals.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "StreamTube — Video Sharing Platform",
  description: "A modern full-stack video sharing platform."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
