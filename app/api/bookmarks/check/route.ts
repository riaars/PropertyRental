import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

export const POST = async (request: Request) => {
  try {
    await connectDB();
    const { propertyId } = await request.json();
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    const { userId } = sessionUser;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    //find user in db

    //check if property is bookmarked
    let isBookmarked = user?.bookmarks.includes(propertyId);
    let message = "";
    if (isBookmarked) {
      //remove property from bookmarks if already bookmarked
      user.bookmarks = user.bookmarks.filter((id) => id !== propertyId);
      message = "Property removed from bookmarks";
      isBookmarked = false;
    } else {
      user.bookmarks.push(propertyId);
      message = "Property added to bookmarks";
      isBookmarked = true;
    }

    await user.save();
    return new Response(JSON.stringify({ isBookmarked }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
