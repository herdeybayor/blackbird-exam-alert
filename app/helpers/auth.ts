import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

import { StudentRegisterData, StudentLoginData } from "@/types/auth";

class AuthHelper {
    private hashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    private verifyPassword(password: string, hashedPassword: string) {
        return bcrypt.compare(password, hashedPassword);
    }

    private isDefaultPassword(password: string) {
        return password === process.env.ADMIN_DEFAULT_PASSWORD;
    }

    public async adminLogin(email: string, password: string) {
        const admin = await prisma.admin.findUnique({
            where: {
                email,
            },
        });

        if (!admin) {
            return {
                success: false,
                message: "Invalid credentials",
            };
        }

        // check if admin has default password
        const isDefaultPassword = this.isDefaultPassword(admin.password);

        if (isDefaultPassword) {
            // Hash the password
            const hashedPassword = await this.hashPassword(password);

            // Update the admin's password
            await prisma.admin.update({
                where: { id: admin.id },
                data: {
                    password: hashedPassword,
                },
            });

            const { password: _, ...adminWithoutPassword } = admin;

            return {
                success: true,
                message: "Password updated successfully",
                admin: adminWithoutPassword,
            };
        }

        // check if password is valid
        const isPasswordValid = await this.verifyPassword(password, admin.password);

        if (!isPasswordValid) {
            return {
                success: false,
                message: "Invalid credentials",
            };
        }

        const { password: _, ...adminWithoutPassword } = admin;

        return {
            success: true,
            message: "Login successful",
            admin: adminWithoutPassword,
        };
    }

    public async studentRegister(data: StudentRegisterData) {
        // check if student already exists
        const student = await prisma.student.findUnique({
            where: { email: data.email },
        });

        if (student) {
            return {
                success: false,
                message: "Student already exists",
            };
        }

        // hash password
        const hashedPassword = await this.hashPassword(data.password);

        // create student
        const newStudent = await prisma.student.create({
            data: { ...data, password: hashedPassword },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                matricNumber: true,
            },
        });

        return {
            success: true,
            message: "Student registered successfully",
            student: newStudent,
        };
    }

    public async studentLogin(data: StudentLoginData) {
        const student = await prisma.student.findUnique({
            where: { matricNumber: data.matricNumber },
        });

        if (!student) {
            return {
                success: false,
                message: "Invalid credentials",
            };
        }

        // check if password is valid
        const isPasswordValid = await this.verifyPassword(data.password, student.password);

        if (!isPasswordValid) {
            return {
                success: false,
                message: "Invalid credentials",
            };
        }

        const { password: _, ...studentWithoutPassword } = student;

        return {
            success: true,
            message: "Login successful",
            student: studentWithoutPassword,
        };
    }
}

export const authHelper = new AuthHelper();
