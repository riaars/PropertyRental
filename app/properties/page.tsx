import React from "react";
import PropertyCard from "@/components/PropertyCard";
import { fetchProperties } from "@/utils/requests";

const PropertiesPage = async () => {
  const properties = await fetchProperties();
  properties.sort((a: any, b: any) => new Date(a.createdAt - b.createdAt));

  return (
    <div className="container-xl lg:container m-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties.length === 0 ? (
          <p>No available properties</p>
        ) : (
          properties?.map((property: any) => (
            <PropertyCard key={property._id} property={property} />
          ))
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;
