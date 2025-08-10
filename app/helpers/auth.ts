import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
}

export const authHelper = new AuthHelper();
