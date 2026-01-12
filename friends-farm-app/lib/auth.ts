import { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    debug: true,
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            httpOptions: {
                timeout: 10000,
            }
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!user || !user.password) {
                    throw new Error("User not found or password not set");
                }

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordCorrect) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    is_admin: user.is_admin
                };
            }
        })
    ],
    callbacks: {
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id as string
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture as string
                session.user.role = token.role as string
            }

            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                // @ts-ignore
                token.role = user.is_admin ? "ADMIN" : "USER"
            } else if (token.id) {
                // If we have an id but no user (periodic refresh), check DB for role
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id as string }
                });
                if (dbUser) {
                    token.role = (dbUser.is_admin ? "ADMIN" : "USER") as "ADMIN" | "USER";
                }
            }
            return token
        },
    },
}
