import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./actions";

// Extend the built-in types for NextAuth
import { DefaultSession, DefaultUser } from "next-auth";
import { register } from "@/repositories/user.repository";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      membershipStatus: string;
      phoneNumber?: string;
      address?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    membershipStatus: string;
    phoneNumber?: string;
    address?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    membershipStatus: string;
    phoneNumber?: string;
    address?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log("Invalid Credentials Format");
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const member = await getUserByEmail(email);

        if (!member || !member.password) {
          console.log(
            "Invalid Credentials: User not found or password is missing"
          );
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, member.password);

        if (passwordsMatch) {
          return {
            id: member.id.toString(),
            email: member.email,
            name: `${member.firstName} ${member.lastName}`,
            phoneNumber: member.phoneNumber ?? undefined, // ensure it's either a string or undefined
            address: member.address ?? undefined, // ensure it's either a string or undefined
            membershipStatus: member.membershipStatus,
            role: member.role,
          };
        }

        console.log("Invalid Credentials: Password mismatch");
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && account.type === "oauth") {
        // This is a login with an OAuth provider
        const email = token.email as string;
        const userFromDb = await getUserByEmail(email);
        if (userFromDb) {
          token.id = userFromDb.id.toString();
          token.role = userFromDb.role;
          token.membershipStatus = userFromDb.membershipStatus;
        } else {
          // Handle new user registration here if needed
          // For now, we'll set a default role
          const newUser = {
            firstName: token.name || "",
            lastName: token.name || "",
            email: token.email || "",
            password: "",
            phoneNumber: null,
            address: null,
            role: "user",
            membershipStatus: "active",
          };
          console.log("before register");
          await register(newUser);
          console.log("after register");
          token.role = "user";
          token.membershipStatus = "active";
          const dbFromUser = await getUserByEmail(email);
          const id = dbFromUser?.id.toString();
          token.id = id || "";
        }
      } else if (user) {
        token.id = user.id;
        token.role = user.role;
        token.membershipStatus = user.membershipStatus;
        token.phoneNumber = user.phoneNumber;
        token.address = user.address;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.membershipStatus = token.membershipStatus;
        session.user.phoneNumber = token.phoneNumber;
        session.user.address = token.address;
      }
      return session;
    },
  },
  pages: {
    signIn: "/en/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
