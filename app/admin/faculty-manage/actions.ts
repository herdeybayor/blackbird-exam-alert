"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFaculties() {
    const faculties = await prisma.faculty.findMany({
        include: {
            facultyHalls: true,
            timeTables: {
                include: {
                    courses: true,
                },
            },
        },
    });

    return {
        success: true,
        faculties,
    };
}

export async function createFaculty(name: string) {
    try {
        const faculty = await prisma.faculty.create({
            data: {
                name,
            },
        });

        revalidatePath("/admin/faculty-manage");
        return {
            success: true,
            message: "Faculty created successfully",
            faculty,
        };
    } catch (error) {
        console.error("Error creating faculty:", error);
        return {
            success: false,
            message: "Failed to create faculty",
        };
    }
}

export async function deleteFaculty(id: string) {
    try {
        await prisma.faculty.delete({
            where: { id },
        });

        revalidatePath("/admin/faculty-manage");
        return {
            success: true,
            message: "Faculty deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting faculty:", error);
        return {
            success: false,
            message: "Failed to delete faculty",
        };
    }
}

export async function addFacultyHall(facultyId: string, name: string, maxCapacity: number) {
    try {
        const hall = await prisma.facultyHall.create({
            data: {
                name,
                facultyId,
                maxCapacity,
            },
        });

        revalidatePath("/admin/faculty-manage");
        return {
            success: true,
            message: "Hall added successfully",
            hall,
        };
    } catch (error) {
        console.error("Error adding hall:", error);
        return {
            success: false,
            message: "Failed to add hall",
        };
    }
}

export async function deleteFacultyHall(id: string) {
    try {
        await prisma.facultyHall.delete({
            where: { id },
        });

        revalidatePath("/admin/faculty-manage");
        return {
            success: true,
            message: "Hall deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting hall:", error);
        return {
            success: false,
            message: "Failed to delete hall",
        };
    }
}

export async function createTimeTable(facultyId: string, name: string, session: string) {
    try {
        const timetable = await prisma.timeTable.create({
            data: {
                name,
                facultyId,
                session,
            },
        });

        revalidatePath("/admin/faculty-manage");
        return {
            success: true,
            message: "Timetable created successfully",
            timetable,
        };
    } catch (error: unknown) {
        console.error("Error creating timetable:", error);
        
        // Handle unique constraint violation for session
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002' && 
            'meta' in error && error.meta && typeof error.meta === 'object' && 'target' in error.meta &&
            Array.isArray(error.meta.target) && error.meta.target.includes('session')) {
            return {
                success: false,
                message: "A timetable for this session already exists",
            };
        }
        
        return {
            success: false,
            message: "Failed to create timetable",
        };
    }
}

export async function deleteTimeTable(id: string) {
    try {
        await prisma.timeTable.delete({
            where: { id },
        });

        revalidatePath("/admin/faculty-manage");
        return {
            success: true,
            message: "Timetable deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting timetable:", error);
        return {
            success: false,
            message: "Failed to delete timetable",
        };
    }
}

export async function addCourseToTimeTable(
    timeTableId: string,
    courseCode: string,
    courseTitle: string,
    courseUnit: number,
    numberOfStudents: number
) {
    try {
        const course = await prisma.timeTableCourse.create({
            data: {
                timeTableId,
                courseCode,
                courseTitle,
                courseUnit,
                numberOfStudents,
            },
        });

        revalidatePath("/admin/faculty-manage");
        return {
            success: true,
            message: "Course added successfully",
            course,
        };
    } catch (error) {
        console.error("Error adding course:", error);
        return {
            success: false,
            message: "Failed to add course",
        };
    }
}

export async function deleteCourse(id: string) {
    try {
        await prisma.timeTableCourse.delete({
            where: { id },
        });

        revalidatePath("/admin/faculty-manage");
        return {
            success: true,
            message: "Course deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting course:", error);
        return {
            success: false,
            message: "Failed to delete course",
        };
    }
}
