import { getFaculties } from "./actions";
import { FacultyManageClient } from "./faculties-client";
import { getAdmin } from "@/app/helpers/admin";
import { NotAuthorized } from "../components/not-autorized";

export const dynamic = 'force-dynamic';

export default async function FacultyManage() {
    const admin = await getAdmin();
    const { faculties } = await getFaculties();

    if (!admin) {
        return <NotAuthorized />;
    }

    return <FacultyManageClient faculties={faculties} />;
}
