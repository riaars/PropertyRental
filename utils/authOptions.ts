import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/config/database";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId:
        process.env.GOOGLE_CLIENT_ID ||
        (() => {
          throw new Error("GOOGLE_CLIENT_ID is not defined");
        })(),
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ||
        (() => {
          throw new Error("GOOGLE_CLIENT_SECRET is not defined");
        })(),
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }: any) {
      await connectDB();
      const userExists = await User.findOne({ email: profile.email });
      if (!userExists) {
        //Truncate username is too long
        const username = profile.name.slice(0, 20);
        await User.create({
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: username,
        });
      }

      return true;
    },

    async session({ session }: any) {
      const user = await User.findOne({ email: session.user.email });

      session.user.id = user._id.toString();
      return session;
    },
  },
};
