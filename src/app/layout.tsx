import "./globals.css";
import StyledComponentsRegistry from "./registry";
import { PortfolioProvider } from "../components/db/PortfolioContext";
import GlobalStyle from "../components/GlobalStyle";
import { Toaster } from "react-hot-toast";
import { getPortfolioData } from "@/lib/get-portfolio-data";

export const metadata = {
  title: "Ankit Bhuria | Portfolio",
  description: "Official website and portfolio of Ankit Bhuria.",
  metadataBase: new URL("https://upgraderboy.tech"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialData;
  try {
    initialData = await getPortfolioData();
  } catch (err) {
    console.error("Failed to load root layout portfolio data:", err);
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* BOXICONS */}
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
        {/* UNICONS */}
        <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.8/css/line.css" />
        {/* Blocking theme and accent color script to prevent layout flashes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Resolve Theme Mode
                  var mode = localStorage.getItem('mode');
                  var theme = mode === 'light' ? 'light' : 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                  
                  // Resolve Accent Color
                  var accentColor = localStorage.getItem('portfolio_accent_color');
                  if (accentColor) {
                    document.documentElement.style.setProperty('--green-color', accentColor);
                    document.documentElement.style.setProperty('--btn-color', accentColor);
                  }
                  
                  // Double apply on DOM content loaded
                  document.addEventListener('DOMContentLoaded', function() {
                    document.body.setAttribute('data-theme', theme);
                  });
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body>
        <StyledComponentsRegistry>
          <PortfolioProvider initialData={initialData}>
            <GlobalStyle />
            <Toaster position="top-right" />
            {children}
          </PortfolioProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
