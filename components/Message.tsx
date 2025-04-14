"use client";
import { useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import { useGlobalContext } from "@/context/GlobalContex";

const Message = ({ message }: any) => {
  const [isRead, setIsRead] = useState(message.read);
  const [isDeleted, setIsDeleted] = useState(false);

  const { setUnreadCount } = useGlobalContext();

  const handleReadClick = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/messages/${message._id}`,
        {
          method: "PUT",
        }
      );

      if (res.status === 200) {
        const { read } = await res.json();
        setIsRead(read);
        setUnreadCount((prevCount: number) => prevCount + (read ? -1 : 1));

        if (read) {
          toast.success("Message marked as read successfully");
        } else {
          toast.success("Message marked as new successfully");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, please try again later");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/messages/${message._id}`,
        {
          method: "DELETE",
        }
      );

      if (res.status === 200) {
        setIsDeleted(true);
        setUnreadCount((prevCount: number) => prevCount - 1);
        toast.success("Message deleted successfully");
      } else {
        toast.error("Failed to delete message");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, please try again later");
    }
  };

  if (isDeleted) {
    return null;
  }

  return (
    <div className="relative bg-white p-4 rounded-md shadow-md border border-gray-200">
      {!isRead && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-medium">
          New
        </div>
      )}
      <h2 className="text-xl mb-4">
        <span className="font-bold mr-2">Property Inquiry:</span>
        {message.property.name}
      </h2>
      <p className="text-gray-700">{message.body}</p>

      <ul className="mt-4">
        <li>
          <strong>Name:</strong> {message.name}
        </li>

        <li>
          <strong>Reply Email:</strong>
          <a href={`mailto:${message.email}`} className="text-blue-500 ml-2">
            {message.email}
          </a>
        </li>
        <li>
          <strong>Reply Phone:</strong>
          <a href={`tel:${message.phone}`} className="text-blue-500 ml-2">
            {message.phone}
          </a>
        </li>
        <li>
          <strong>Received:</strong>{" "}
          {new Date(message.createdAt).toLocaleString()}
        </li>
      </ul>
      <button
        onClick={handleReadClick}
        className={`mt-4 mr-3 ${
          isRead ? "bg-gray-300" : "bg-blue-500 text-white"
        }  py-1 px-3 rounded-md`}
      >
        {isRead ? "Mark as New" : "Mark As Read"}
      </button>
      <button
        onClick={handleDelete}
        className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md"
      >
        Delete
      </button>
    </div>
  );
};

export default Message;
