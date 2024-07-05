import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./db";
import Google from "next-auth/providers/google"

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
    }
}

export const {handlers, auth, signIn, signOut} = NextAuth({
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({ token }) { 
            if (!token.id) {
                const db_user = await prisma.user.findFirst({
                    where: {
                        email: token?.email
                    }
                });
                if (db_user) {
                    token.id = db_user.id;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email ?? '';
                session.user.image = token.picture;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET
        }),
    ]
});
