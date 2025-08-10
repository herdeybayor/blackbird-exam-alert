import { cookies } from "next/headers";
import { Student } from "../generated/prisma";

export async function getStudent() {
    const cookieStore = await cookies();
    const student = cookieStore.get("student");
    return student ? (JSON.parse(student.value) as Student) : null;
}
