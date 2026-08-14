import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata = {
  title: "AgroNex — Agricultural Decision Intelligence",
  description: "Enterprise-grade crop intelligence platform evaluating soil compatibility, live Open-Meteo weather, and commodity market prices.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-[#1D1D1F] bg-[#F5F5F7] min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-[#1D1D1F] text-[#86868B] py-8 border-t border-black/10 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">AgroNex</span>
              <span className="text-[#86868B]">— Agricultural Intelligence Engine</span>
            </div>
            <p className="text-[#86868B] text-[11px] font-medium">
              Powered by Open-Meteo Weather, OpenStreetMap Nominatim, & ISRIC SoilGrids.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
