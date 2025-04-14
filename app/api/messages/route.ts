import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

//POST /api/messages
export const POST = async (request: Request) => {
  try {
    await connectDB();
    const { name, email, phone, message, property, recipient } =
      await request.json();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.user) {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 401,
      });
    }
    const { user } = sessionUser;
    // Can not send message to self
    if (user.id === recipient) {
      return new Response(
        JSON.stringify({ message: "Can not send a message to yourself" }),
        { status: 400 }
      );
    }
    const newMessage = new Message({
      sender: user.id,
      recipient,
      email,
      property,
      phone,
      body: message,
      name,
    });

    await newMessage.save();
    return new Response(
      JSON.stringify({ message: "Message sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Something went wrong" }), {
      status: 500,
    });
  }
};
