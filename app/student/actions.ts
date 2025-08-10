"use server";

import { authHelper } from "../helpers/auth";

export async function studentLogout() {
    const { success, message } = await authHelper.studentLogout();

    return { success, message };
}
