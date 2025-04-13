"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaCircleArrowLeft } from "react-icons/fa6";
import Spinner from "@/components/Spinner";
import PropertyCard from "@/components/PropertyCard";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = searchParams.get("location") || "";
  const propertyType = searchParams.get("propertyType") || "";

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/search?location=${location}&propertyType=${propertyType}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/search?location=${location}&propertyType=${propertyType}`
        );
        const data = await res.json();
        if (res.ok) {
          setProperties(data);
        } else {
          setProperties([]);
          console.error(data.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [location, propertyType]);

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <div className="container-xl lg:container m-auto px-4 py-6">
      <Link
        href={"/properties"}
        className="flex items-center text-blue-500 hover:underline mb-3"
      >
        <FaCircleArrowLeft className="mb-1 mr-2" /> Back to properties
      </Link>
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
  );
};

export default SearchResultsPage;
