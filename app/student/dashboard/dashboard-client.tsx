"use client";

import { Student } from "@/app/generated/prisma";
import { studentLogout } from "../actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DashboardClient({ student }: { student: Student }) {
    const router = useRouter();

    const handleLogout = async () => {
        const { success, message } = await studentLogout();
        if (success) {
            toast.success(message);
            router.push("/student/login");
        } else {
            toast.error(message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-lg">Welcome {student.firstName}</p>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
}
