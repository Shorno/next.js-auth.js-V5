import NextAuth, {CredentialsSignin} from "next-auth"
import Credentials from "@auth/core/providers/credentials";
import {connectDB} from "@/lib/db";
import {User} from "@/models/Users";
import {compare} from "bcryptjs";

export const {handlers, signIn, signOut, auth} = NextAuth({
    providers: [
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
})
