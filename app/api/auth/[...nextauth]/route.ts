import { authOptions } from "@/utils/authOptions";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions as AuthOptions);
export { handler as GET, handler as POST };
