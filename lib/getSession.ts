import {cache} from "react";
import {auth} from "@/auth";

export const getSession = cache(async () => {
    return await auth()
})
