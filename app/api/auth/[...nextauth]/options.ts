import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient();

export const options: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email:",
          type: "text",
          placeholder: "your-email"
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "your-password"
        }
      },
      async authorize(credentials) { 
        if(!credentials) return null;
        //console.log('credentials:',credentials);
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })
        //console.log('user:', user);
        if (user && bcrypt.compareSync(credentials.password, user.hashedPassword)) {
          return user
        } else {
          return null
        }    

      }
    })
  ],
  callbacks: {
    async jwt({ token, user, session }) : Promise<any> {
      //console.log("jwt callback", {token, user, session});
      if (user) {
        return {
          ...token,
          id: user.id
        }
      }
      return token;
    },
    async session({ session, token, user }) : Promise<any> {
      //console.log("session callback", {session, token, user});
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id
        }
      }
    },
  },
  pages: {
    signIn: '/signin'
  },
  session: {
    strategy: 'jwt',
  },
}