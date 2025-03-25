import React from "react";
import "@/assets/styles/global.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Property | Find the Perfect Rental",
  description: "Find your dream rental property",
  keywords: "rental, find rentals, find properties",
};

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div> {children}</div>
      </body>
    </html>
  );
};

export default MainLayout;
