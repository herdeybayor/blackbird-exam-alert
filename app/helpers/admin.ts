import { cookies } from "next/headers";
import { Admin } from "../generated/prisma";

export async function getAdmin() {
    const cookieStore = await cookies();
    const admin = cookieStore.get("admin");
    return admin ? (JSON.parse(admin.value) as Admin) : null;
}
