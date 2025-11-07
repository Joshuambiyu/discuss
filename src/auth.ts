import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./app/db";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// NextAuth needs NEXTAUTH_URL set in production so callback URLs are generated correctly.
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET){
    throw new Error ('Missing github oauth credentials');
}

// Helpful guard: if we're running in production, require NEXTAUTH_URL so redirect/callback
// URLs aren't generated as localhost. This helps catch the "callback still pointing to
// localhost" problem early.
if (process.env.NODE_ENV === 'production' && !NEXTAUTH_URL) {
    throw new Error('Missing NEXTAUTH_URL environment variable. Set NEXTAUTH_URL to your production URL (e.g. https://example.com)');
}

export const{handlers:{GET,POST}, auth, signOut, signIn}=NextAuth({
    adapter: PrismaAdapter(db),
    providers: [
        Github({
            clientId: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET
        })
    ],
    callbacks:{
        //not needed fixing bug for nextauth
        async session ({session, user}: any){
            if(session && user){
                session.user.id=user.id;
            }
            return session;

        },
    },
});