import connectDB from "@/config/database";
import Property from "@/models/Property";
import { NextRequest } from "next/server";

interface Params {
  params: {
    userId: string;
  };
}
// GET /api/properties/user/:[userId]
export const GET = async (_request: NextRequest, { params }: Params) => {
  try {
    await connectDB();
    const userId = params.userId;
    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }
    const properties = await Property.find({ owner: userId });
    return new Response(JSON.stringify(properties), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
