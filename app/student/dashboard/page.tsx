import { getStudent } from "@/app/helpers/student";
import DashboardClient from "./dashboard-client";
import { redirect } from "next/navigation";

async function Dashboard() {
    const student = await getStudent();

    if (!student) {
        redirect("/student/login");
    }

    return <DashboardClient student={student} />;
}

export default Dashboard;
