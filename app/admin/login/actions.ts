"use server";

import { authHelper } from "@/app/helpers/auth";
import { cookies } from "next/headers";

export async function adminLogin(email: string, password: string) {
    const { success, message, admin } = await authHelper.adminLogin(email, password);

    if (success) {
        // set admin in cookies
        const cookieStore = await cookies();
        cookieStore.set("admin", JSON.stringify(admin), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
    }

    return { success, message };
}
