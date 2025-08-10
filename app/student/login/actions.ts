"use server";

import { authHelper } from "@/app/helpers/auth";
import { StudentLoginData } from "@/types/auth";
import { cookies } from "next/headers";

export async function studentLogin(data: StudentLoginData) {
    const { success, message, student } = await authHelper.studentLogin(data);

    if (success) {
        // set student in cookies
        const cookieStore = await cookies();
        cookieStore.set("student", JSON.stringify(student), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
    }

    return { success, message };
}
