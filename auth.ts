import NextAuth, {CredentialsSignin} from "next-auth"
import Credentials from "@auth/core/providers/credentials";
import {connectDB} from "@/lib/db";
import {User} from "@/models/Users";
import {compare} from "bcryptjs";
import Github from "next-auth/providers/github"
import Google from "@auth/core/providers/google";

export const {handlers, signIn, signOut, auth} = NextAuth({
    providers: [

        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),


        Credentials({
            name: "Credentials",

            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },

            authorize: async (credentials) => {
                const email = credentials.email as string | undefined;
                const password = credentials.password as string | undefined;

                if (!email || !password) {
                    throw new CredentialsSignin("Please provide both email and password")
                }

                await connectDB();

                const user = await User.findOne({email}).select("+password +role")

                if (!user) {
                    throw new Error("No user found with this email");
                }

                if (!user.password) {
                    throw new Error("Invalid user or password");
                }

                const isMatched = await compare(password, user.password)
                if (!isMatched) {
                    throw new Error("Password did not match.");
                }

                return {
                    firstname: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    id: user._id,
                };
            },

        })
    ],

    pages: {
        signIn: "/login"
    },

    callbacks: {
        async session({session, token}) {
            if (token?.sub && token?.role) {
                session.user.id = token.sub;
                session.user.role = token.role;
            }
            return session;
        },

        async jwt({token, user}) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },

        signIn: async ({user, account}) => {
            if (account?.provider === "google") {

                try {
                    const {email, name, image, id} = user;
                    await connectDB()

                    const alreadyUser = await User.findOne({email})

                    if (!alreadyUser) {
                        await User.create({email, name, image, providerId: id})
                    } else {
                        return true;
                    }
                } catch (error) {
                    throw new Error("Error while creating user.")
                }
            }
            if (account?.provider === "credentials") {
                return true;

            } else {
                return false;
            }
        }


    }
})
