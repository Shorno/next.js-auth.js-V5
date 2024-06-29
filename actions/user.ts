"use server"

import {connectDB} from "@/lib/db";
import {User} from "@/models/Users";
import {redirect} from "next/navigation";
import {hash} from "bcryptjs"
import {signIn} from "@/auth";
import {CredentialsSignin} from "next-auth";


export const register = async (formData: FormData) => {
    const firstName = formData.get("firstname") as string;
    const lastName = formData.get("lastname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!firstName || !lastName || !email || !password) {
        throw new Error("Please fill in all fields")
    }

    await connectDB();

    const existingUser = await User.findOne({email})
    if (existingUser) throw new Error("User already exists")

    const hashedPassword = await hash(password, 16)

    await User.create({firstName, lastName, email, password: hashedPassword})
    console.log("User created successfully")

    redirect("/login")

}

export const login = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        await signIn("credentials", {
            redirect: false,
            callbackUrl: "/",
            email,
            password,
        });
    } catch (error) {
        const someError = error as CredentialsSignin;
        return someError.cause;
    }
    redirect("/");
};


export const fetchAllUsers = async () => {
    await connectDB()
    return User.find({});
}
