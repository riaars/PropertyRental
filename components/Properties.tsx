"use client";
import { useEffect, useState } from "react";
import React from "react";
import PropertyCard from "./PropertyCard";
import Pagination from "./Pagination";

const Properties = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalProperties, setTotalProperties] = useState(0);

  properties.sort(
    (a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties?page=${page}&pageSize=${pageSize}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await res.json();
        setProperties(data.properties);
        setTotalProperties(data.totalProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [page, pageSize]);

  return (
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
      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={totalProperties}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Properties;
