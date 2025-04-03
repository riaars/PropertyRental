import React from "react";
import PropertyCard from "@/components/PropertyCard";

async function fetchProperties() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/properties`);
    if (!res.ok) {
      throw new Error("Failed to fetch");
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
}

const PropertiesPage = async () => {
  const properties = await fetchProperties();

  return (
    <div className="container-xl lg:container m-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties?.map((property: any) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default PropertiesPage;
