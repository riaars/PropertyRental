import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

interface Params {
  params: {
    id: string;
  };
}

import { PropertyDataProps } from "@/types/property";
import { NextRequest } from "next/server";

// GET /api/properties
export const GET = async (_request: NextRequest, { params }: Params) => {
  console.log(params);
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

export const DELETE = async (_request: NextRequest, { params }: Params) => {
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

// PUT /api/properties/:id
export const PUT = async (request: Request, { params }: Params) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { id } = params;

    const { userId } = sessionUser;

    const formData = await request.formData();
    //access all values from amenities and images

    const amenities = formData.getAll("amenities") as string[];

    //Get property to update

    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      return new Response("Property not found", { status: 404 });
    }
    if (existingProperty.owner.toString() !== userId) {
      return new Response("You are not authorized to update this property", {
        status: 401,
      });
    }
    const propertyData: PropertyDataProps = {
      type: formData.get("type") as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      location: {
        street: formData.get("location.street") as string,
        city: formData.get("location.city") as string,
        state: formData.get("location.state") as string,
        zipcode: formData.get("location.zipcode") as string,
      },
      beds: Number(formData.get("beds")),
      baths: Number(formData.get("baths")),
      square_feet: Number(formData.get("square_feet")),
      amenities,
      rates: {
        weekly: Number(formData.get("rates.weekly")),
        monthly: Number(formData.get("rates.monthly")),
        nightly: Number(formData.get("rates.nightly")),
      },
      seller_info: {
        name: formData.get("seller_info.name") as string,
        email: formData.get("seller_info.email") as string,
        phone: formData.get("seller_info.phone") as string,
      },
      owner: userId,
      // images,
    };

    //update property in db
    const updatedProperty = await Property.findByIdAndUpdate(id, propertyData);

    return new Response(JSON.stringify(updatedProperty), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to create property", { status: 500 });
  }
};
