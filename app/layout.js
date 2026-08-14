import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata = {
  title: "AgroNex — Smart Agricultural Intelligence & Crop Optimization",
  description: "Enterprise-grade crop intelligence platform evaluating soil compatibility, live Open-Meteo weather, and commodity market prices.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-slate-900 bg-surface-canvas min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-sm">AgroNex</span>
              <span>— Smart Agricultural Intelligence Platform</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Powered by Open-Meteo Weather, OpenStreetMap Nominatim, and ISRIC SoilGrids APIs.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
