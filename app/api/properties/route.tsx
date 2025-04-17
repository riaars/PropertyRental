import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { PropertyDataProps } from "@/types/property";
import { getSessionUser } from "@/utils/getSessionUser";
import { NextRequest } from "next/server";

// GET /api/properties
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    const page = request.nextUrl.searchParams.get("page") || 1;
    const pageSize = request.nextUrl.searchParams.get("pageSize") || 6;
    const skip = (Number(page) - 1) * Number(pageSize);

    const totalProperties = await Property.countDocuments({});

    const properties = await Property.find({})
      .skip(skip)
      .limit(Number(pageSize));
    return new Response(JSON.stringify({ totalProperties, properties }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser;

    const formData = await request.formData();
    //access all values from amenities and images

    const amenities = formData.getAll("amenities") as string[];
    const images = (formData.getAll("images") as File[]).filter(
      (image: File) => image.name !== ""
    ); // Filter out any undefined values

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

    const imageUploadPromises = [];

    for (const image of images) {
      //convert image to buffer
      const buffer = await image.arrayBuffer();

      // convert to unint array
      const imageArray = Array.from(new Uint8Array(buffer));
      const imageData = Buffer.from(imageArray);

      // convert the image to base64
      const imageBase64 = imageData.toString("base64");

      //upload to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        {
          folder: "propertypulse",
        }
      );

      imageUploadPromises.push(uploadResponse.secure_url);
    }

    //wait for all images to upload
    const uploadedImages = await Promise.all(imageUploadPromises);
    // add uploaded images to property data
    propertyData.images = uploadedImages;

    //console.log(propertyData);

    const newProperty = new Property(propertyData);
    await newProperty.save();
    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`
    );

    // return new Response(JSON.stringify({ message: "ok" }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to create property", { status: 500 });
  }
};
