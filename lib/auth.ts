import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "./dbConnect";
import User from "@/schema/UserSchema";


export const { handlers, signIn, signOut, auth } = NextAuth({

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),

    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@demo.com", required: true },
        password: { label: "Password", type: "password", placeholder: "password", required: true }
      },
      async authorize(credentials) {

        await dbConnect()

        const { email, password } = credentials as { email: string; password: string };

        if (!email || !password) {
          throw new Error("Invalid credentials");
        }

        try {
          const existingUser = await User.findOne({ email });

          if (!existingUser) {
            throw new Error("User not found");
          }

          const isVerified = await bcrypt.compare(password, existingUser.password);

          if (!isVerified) {
            console.log("Wrong Password")
            throw new Error("Invalid password");
          }

          return {
            id: existingUser.id.toString(),
            email: existingUser.email,
            name: existingUser.name,
          };
        } catch (error) {
          console.log(error)
          throw new Error(`Authorization error`);
        }
      }
    })
  ],
  pages: {
    signIn: '/signin'
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name

      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name
      }
      return session;
    },
  }
})