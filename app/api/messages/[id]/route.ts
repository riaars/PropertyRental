import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

interface Params {
  params: {
    id: string;
  };
}
//PUT /api/messages/:id
export const PUT = async (_request: NextRequest, { params }: Params) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.user) {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 401,
      });
    }
    const { id } = params;
    const { userId } = sessionUser;
    const message = await Message.findById(id);

    if (!message) {
      return new Response(JSON.stringify({ message: "Message not found" }), {
        status: 404,
      });
    }
    if (message.recipient.toString() !== userId) {
      return new Response(
        JSON.stringify({
          message: "You are not authorized to update this message",
        }),
        {
          status: 401,
        }
      );
    }
    message.read = !message.read;
    await message.save();
    return new Response(
      JSON.stringify({
        read: message.read,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Something went wrong" }), {
      status: 500,
    });
  }
};

//DELETE /api/messages/:id
export const DELETE = async (_request: NextRequest, { params }: Params) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.user) {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 401,
      });
    }
    const { id } = params;
    const { userId } = sessionUser;
    const message = await Message.findById(id);

    if (!message) {
      return new Response(JSON.stringify({ message: "Message not found" }), {
        status: 404,
      });
    }
    if (message.recipient.toString() !== userId) {
      return new Response(
        JSON.stringify({
          message: "You are not authorized to delete this message",
        }),
        {
          status: 401,
        }
      );
    }
    await message.deleteOne();
    return new Response(
      JSON.stringify({
        message: "Message deleted successfully",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Something went wrong" }), {
      status: 500,
    });
  }
};
