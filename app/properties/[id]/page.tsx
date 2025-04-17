"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchProperty } from "@/utils/requests";
import PropertyHeaderImage from "@/components/PropertyHeaderImage";
import Link from "next/link";
import PropertyDetails from "@/components/PropertyDetails";
import { FaArrowLeft } from "react-icons/fa6";
import Spinner from "@/components/Spinner";
import PropertyImages from "@/components/PropertyImages";
import BookmarkButton from "@/components/BookmarkButton";
import ShareButton from "@/components/ShareButton";
import PropertyContactForm from "@/components/PropertyContactForm";
import { PropertyDataProps } from "@/types/property";

const PropertiesDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<PropertyDataProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return;
      try {
        const property = await fetchProperty(Array.isArray(id) ? id[0] : id);
        setProperty(property);
      } catch (error) {
        console.log("Error fetching property", error);
      } finally {
        setLoading(false);
      }
    };

    if (property === null) {
      fetchPropertyData();
    }
  }, [id, property]);

  if (!property && !loading) {
    return (
      <h1 className="text-center text-2xl font-bold mt-10">
        Property Not Found
      </h1>
    );
  }

  return (
    <>
      {loading && <Spinner loading={loading} />}
      {!loading && property && (
        <>
          <PropertyHeaderImage image={property.images[0]} />
          <section>
            <div className="container m-auto py-6 px-6">
              <Link
                href="/properties"
                className="text-blue-500 hover:text-blue-600 flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Back to Properties
              </Link>
            </div>
          </section>
          <section className="bg-blue-50">
            <div className="container m-auto py-10 px-6">
              <div className="grid grid-cols-1 grid-cols-[70%_30%]  w-full gap-6">
                <PropertyDetails property={property} />
                <aside className="space-y-4">
                  <BookmarkButton property={property} />
                  <ShareButton property={property} />
                  <PropertyContactForm property={property} />
                </aside>
              </div>
            </div>

            <PropertyImages images={property.images} />
          </section>
        </>
      )}
    </>
  );
};

export default PropertiesDetails;
