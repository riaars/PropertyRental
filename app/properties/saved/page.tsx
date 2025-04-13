"use client";
import React from "react";
import { useState, useEffect } from "react";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";

const SavedPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/bookmarks`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setProperties(data);
        } else {
          toast.error(data.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Error fetching saved properties:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, []);

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <div className="container-xl lg:container m-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Saved Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties.length === 0 ? (
          <p>No saved properties</p>
        ) : (
          properties?.map((property: any) => (
            <PropertyCard key={property._id} property={property} />
          ))
        )}
      </div>
    </div>
  );
};

export default SavedPropertiesPage;
