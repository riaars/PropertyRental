"use client";
import React from "react";
import { FaBookmark } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { PropertyDataProps } from "@/types/property";
const BookmarkButton = ({ property }: { property: PropertyDataProps }) => {
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = session?.user?.id;

  const handleClick = async () => {
    if (!userId) {
      toast.error("Please log in to bookmark properties.");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/bookmarks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ propertyId: property._id }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setIsBookmarked(data.isBookmarked);
        toast.success(data.message);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error bookmarking property:", error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/bookmarks/check`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ propertyId: property._id }),
          }
        );
        const data = await res.json();
        if (res.ok) {
          setIsBookmarked(data.isBookmarked);
        }
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      } finally {
        setLoading(false);
      }
    };
    checkBookmarkStatus();
  }, [userId, property._id]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return isBookmarked ? (
    <button
      onClick={handleClick}
      className="bg-red-500 hover:bg-red-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
    >
      <FaBookmark className="mr-2" /> Remove Bookmark
    </button>
  ) : (
    <button
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
    >
      <FaBookmark className="mr-2" /> Bookmark Property
    </button>
  );
};

export default BookmarkButton;
