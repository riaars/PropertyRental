"use client";

import React from "react";
import { useRouter } from "next/navigation";

const PropertiesDetails = () => {
  const router = useRouter();
  return (
    <div>
      <button
        onClick={() => router.push("/")}
        className="bg-blue-500 p-2 text-white rounded-full m-2"
      >
        Go home
      </button>
    </div>
  );
};

export default PropertiesDetails;
