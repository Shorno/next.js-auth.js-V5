import NextAuth from "next-auth"
import Credentials from "@auth/core/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name : "Credentials",
            credentials : {

            }
        })
    ],
})
