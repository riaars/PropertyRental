import connectDB from "@/config/database";
import Property from "@/models/Property";
import { NextRequest } from "next/server";

// GET /api/properties/search
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location") || "";
    const propertyType = searchParams.get("propertyType") || "";
    const locationPattern = new RegExp(location, "i");

    const query = {
      $or: [
        { name: locationPattern },
        { description: locationPattern },
        { "location.city": locationPattern },
        { "location.state": locationPattern },
        { "location.street": locationPattern },
        { "location.zipcode": locationPattern },
      ],
    };

    // check if property type is not 'All'
    if (propertyType && propertyType !== "All") {
      const typePattern = new RegExp(propertyType, "i");
      query.type = typePattern;
    }
    const properties = await Property.find(query).sort({ createdAt: -1 });

    return new Response(JSON.stringify(properties), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
