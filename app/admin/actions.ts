"use server";

import { authHelper } from "../helpers/auth";

export async function adminLogout() {
    const { success, message } = await authHelper.adminLogout();

    return { success, message };
}
