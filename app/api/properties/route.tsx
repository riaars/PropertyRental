import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

// GET /api/properties
export const GET = async (request: any) => {
  try {
    await connectDB();
    const properties = await Property.find({});
    return new Response(JSON.stringify(properties), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

export const POST = async (request: any) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }

    const { userId } = sessionUser;

    const formData = await request.formData();
    //access all values from amenities and images

    const amenities = formData.getAll("amenities");
    const images = formData
      .getAll("images")
      .filter((image: any) => image.name !== ""); // Filter out any undefined values

    const propertyData: any = {
      type: formData.get("type"),
      name: formData.get("name"),
      description: formData.get("description"),
      location: {
        street: formData.get("location.street"),
        city: formData.get("location.city"),
        state: formData.get("location.state"),
        zipcode: formData.get("location.zipcode"),
      },
      beds: formData.get("beds"),
      baths: formData.get("baths"),
      square_feet: formData.get("square_feet"),
      amenities,
      rates: {
        weekly: formData.get("rates.weekly"),
        monthly: formData.get("rates.monthly"),
        nightly: formData.get("rates.nightly"),
      },
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
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
