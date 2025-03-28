import React from "react";
import properties from "@/properties.json";
import PropertyCard from "@/components/PropertyCard";

const PropertiesPage = () => {
  return (
    <div className="container-xl lg:container m-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties.map((property: any) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default PropertiesPage;
