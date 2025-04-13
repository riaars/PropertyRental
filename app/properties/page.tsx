import React from "react";
import PropertyCard from "@/components/PropertyCard";
import { fetchProperties } from "@/utils/requests";
import PropertySearchForm from "@/components/PropertySearchForm";

const PropertiesPage = async () => {
  const properties = await fetchProperties();
  properties.sort(
    (a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      <section className="bg-blue-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flec-col items-start sm:px-6 lg:px-8">
          <PropertySearchForm />
        </div>
      </section>

      <div className="container-xl lg:container m-auto px-4 py-6">
        <h1 className="text-2xl mb-4">Search Results</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.length === 0 ? (
            <p>No search results found</p>
          ) : (
            properties?.map((property: any) => (
              <PropertyCard key={property._id} property={property} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default PropertiesPage;
