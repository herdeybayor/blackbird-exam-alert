import { AdminDashboardClient } from "./dashboard-client";
import { getAdmin } from "@/app/helpers/admin";

export default async function AdminDashboard() {
    const admin = await getAdmin();

    return <AdminDashboardClient admin={admin} />;
}
