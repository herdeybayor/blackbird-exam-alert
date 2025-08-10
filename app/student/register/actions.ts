"use server";

import { authHelper } from "@/app/helpers/auth";
import { StudentRegisterData } from "@/types/auth";

export async function studentRegister(data: StudentRegisterData) {
    const { success, message } = await authHelper.studentRegister(data);

    return { success, message };
}
