"use server";

import { authHelper } from "../helpers/auth";
import prisma from "@/lib/prisma";
import { getStudent } from "../helpers/student";

export async function studentLogout() {
    const { success, message } = await authHelper.studentLogout();

    return { success, message };
}

export async function getStudentExams() {
    const student = await getStudent();
    
    if (!student) {
        return { success: false, exams: [], message: "Not authenticated" };
    }

    try {
        // Find the faculty that matches the student's faculty name
        const faculty = await prisma.faculty.findFirst({
            where: { 
                name: { 
                    equals: student.faculty, 
                    mode: 'insensitive' 
                } 
            },
            include: {
                timeTables: {
                    include: {
                        courses: {
                            include: {
                                hall: true,
                                examSessions: {
                                    include: { hall: true },
                                    orderBy: { sessionNumber: 'asc' }
                                }
                            },
                            orderBy: { examDate: 'asc' }
                        }
                    }
                }
            }
        });

        if (!faculty) {
            return { success: false, exams: [], message: "Faculty not found" };
        }

        // Flatten all courses from all timetables
        const allCourses = faculty.timeTables.flatMap(timeTable => 
            timeTable.courses.map(course => ({
                ...course,
                timeTableName: timeTable.name,
                timeTableSession: timeTable.session,
                faculty: faculty.name
            }))
        );

        return { 
            success: true, 
            exams: allCourses,
            message: "Exams fetched successfully" 
        };
    } catch (error) {
        console.error("Error fetching student exams:", error);
        return { success: false, exams: [], message: "Error fetching exams" };
    }
}

export async function getStudentExamById(courseId: string) {
    const student = await getStudent();
    
    if (!student) {
        return { success: false, exam: null, message: "Not authenticated" };
    }

    try {
        // Find the faculty that matches the student's faculty name
        const faculty = await prisma.faculty.findFirst({
            where: { 
                name: { 
                    equals: student.faculty, 
                    mode: 'insensitive' 
                } 
            }
        });

        if (!faculty) {
            return { success: false, exam: null, message: "Faculty not found" };
        }

        // Find the course and verify it belongs to the student's faculty
        const course = await prisma.timeTableCourse.findFirst({
            where: {
                id: courseId,
                timeTable: { facultyId: faculty.id }
            },
            include: {
                hall: true,
                timeTable: { 
                    include: { faculty: true } 
                },
                examSessions: {
                    include: { hall: true },
                    orderBy: { sessionNumber: 'asc' }
                }
            }
        });

        if (!course) {
            return { success: false, exam: null, message: "Exam not found or access denied" };
        }

        return { 
            success: true, 
            exam: course, 
            message: "Exam details fetched successfully" 
        };
    } catch (error) {
        console.error("Error fetching student exam by ID:", error);
        return { success: false, exam: null, message: "Error fetching exam details" };
    }
}
