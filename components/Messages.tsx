"use client";
import React from "react";
import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/messages`,
          {
            method: "GET",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, []);

  return <div>Messages</div>;
};

export default Messages;
