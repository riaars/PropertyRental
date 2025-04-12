import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

// GET /api/properties
export const GET = async (request: any, { params }: any) => {
  try {
    await connectDB();
    const property = await Property.findById(params.id);
    if (!property) {
      return new Response("Property not found", { status: 404 });
    }
    return new Response(JSON.stringify(property), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
// GET /api/properties

export const DELETE = async (request: any, { params }: any) => {
  try {
    const propertyId = params.id;

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser;
    const property = await Property.find(propertyId);

    if (!property) {
      return new Response("Property is not found", { status: 404 });
    }

    if (property.owner.toString() !== userId) {
      return new Response("You are not authorized to delete this property", {
        status: 401,
      });
    }

    await property.deleteOne();

    return new Response("Property deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
