import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export const getSessionUser = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return null;
    }
    const userId = session?.user?.id;
    return {
      user: session.user,
      id: userId,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
