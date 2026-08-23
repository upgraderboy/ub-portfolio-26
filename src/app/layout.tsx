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
