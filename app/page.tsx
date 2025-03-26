import { Hero } from "@/components/Hero";
import InfoBoxes from "@/components/InfoBoxes";
import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <InfoBoxes />
    </div>
  );
};

export default HomePage;
