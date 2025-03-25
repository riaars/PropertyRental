import React from "react";
import "@/assets/styles/global.css";

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
        <div> {children}</div>
      </body>
    </html>
  );
};

export default MainLayout;
