"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import profileDefault from "@/assets/images/profile.png";
import React from "react";
import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";
import { PropertyDataProps } from "@/types/property";

const ProfilePage = () => {
  const { data: session } = useSession();
  const profileImage = useSession()?.data?.user?.image;
  const profileName = useSession()?.data?.user?.name;
  const profileEmail = useSession()?.data?.user?.email;

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProperties = async (userId: string) => {
      if (!userId) {
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/user/${userId}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await res.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      const userId = session.user?.id;
      if (userId) {
        fetchUserProperties(userId);
      }
    }
  }, [session]);

  const handleDeleteProperty = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (!confirm) {
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        toast.error("Failed to delete property");
        throw new Error("Failed to delete property");
      }

      const updatedProperties = properties.filter(
        (property: PropertyDataProps) => property._id !== id
      );
      setProperties(updatedProperties);
      toast.success("Property deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="bg-blue-50">
      <div className="container m-auto py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 mx-20 mt-10">
              <div className="mb-4">
                <Image
                  className="h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0"
                  src={profileImage || profileDefault}
                  alt="User"
                  width={200}
                  height={200}
                />
              </div>
              <h2 className="text-2xl mb-4">
                <span className="font-bold block">Name: </span> {profileName}
              </h2>
              <h2 className="text-2xl">
                <span className="font-bold block">Email: </span> {profileEmail}
              </h2>
            </div>

            <div className="md:w-3/4 md:pl-4">
              <h2 className="text-xl font-semibold mb-4">Your Listings</h2>
              {!loading && properties.length === 0 && (
                <p>You have no property listings</p>
              )}

              {loading ? (
                <Spinner loading={loading} />
              ) : (
                properties.map((property: PropertyDataProps) => (
                  <div className="mb-10" key={property._id}>
                    <Link href="/property">
                      <Image
                        className="h-32 w-full rounded-md object-cover"
                        src={property.images[0]}
                        alt={property.name}
                        width={300}
                        height={300}
                        priority={true}
                      />
                    </Link>
                    <div className="mt-2">
                      <p className="text-lg font-semibold">{property.name}</p>
                      <p className="text-gray-600">
                        Address: {property.location.street}{" "}
                        {property.location.city} {property.location.zipcode}
                      </p>
                    </div>
                    <div className="mt-2">
                      <Link
                        href={`/properties/${property._id}/edit`}
                        className="bg-blue-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-blue-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProperty(property._id)}
                        className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
