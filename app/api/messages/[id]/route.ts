import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

//PUT /api/messages/:id
export const PUT = async (request: Request, { params }: any) => {
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
