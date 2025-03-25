import Link from "next/link";
import React from "react";

const PropertiesPage = () => {
  console.log("hello");
  return (
    <div>
      <h1 className="text-3xl">Properties</h1>
      <Link href={"/"}>Back to home</Link>
    </div>
  );
};

export default PropertiesPage;
