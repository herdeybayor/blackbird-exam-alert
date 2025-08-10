"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { studentRegister } from "./actions";

export default function StudentRegister() {
    const router = useRouter();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        matricNumber: "",
        phone: "",
        email: "",
        faculty: "",
        department: "",
        level: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.info("Processing your registration...");
        try {
            const { success, message } = await studentRegister(form);

            if (success) {
                toast.success("🎉 Registration successful!");
                // redirect to login
                router.push("/student/login");
            } else {
                toast.error(`❌ Registration failed: ${message}`);
            }
        } catch (err) {
            console.error("register error:", err);
            toast.error("❌ Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md p-4 shadow-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center space-x-2 mb-1">
                        <span className="text-xl">🕒📩</span>
                        <h2 className="text-xl font-bold text-indigo-600">Exam Alert</h2>
                    </div>
                    <CardTitle className="text-2xl">Register</CardTitle>
                    <p>Create Your Account </p>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <div className="w-1/2">
                                <Label className="mb-1">First Name</Label>
                                <Input name="firstName" value={form.firstName} onChange={handleChange} required />
                            </div>
                            <div className="w-1/2">
                                <Label className="mb-1">Last Name</Label>
                                <Input name="lastName" value={form.lastName} onChange={handleChange} required />
                            </div>
                        </div>

                        <div>
                            <Label className="mb-1">Matric Number</Label>
                            <Input name="matricNumber" value={form.matricNumber} onChange={handleChange} required />
                        </div>

                        <div>
                            <Label className="mb-1">Phone Number</Label>
                            <Input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
                        </div>

                        <div>
                            <Label className="mb-1">Email</Label>
                            <Input type="email" name="email" value={form.email} onChange={handleChange} required />
                        </div>

                        <div>
                            <Label className="mb-1">Faculty</Label>
                            <select name="faculty" value={form.faculty} onChange={handleChange} className="w-full border rounded-md p-2" required>
                                <option value="">Select Faculty</option>
                                <option value="Science">Faculty of Science</option>
                                <option value="Engineering">Faculty of Engineering</option>
                            </select>
                        </div>

                        <div>
                            <Label className="mb-1">Department</Label>
                            <select name="department" value={form.department} onChange={handleChange} className="w-full border rounded-md p-2" required>
                                <option value="">Select Department</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Mechanical Engineering">Mechanical Engineering</option>
                            </select>
                        </div>

                        <div>
                            <Label className="mb-1">Level</Label>
                            <select name="level" value={form.level} onChange={handleChange} className="w-full border rounded-md p-2" required>
                                <option value="">Select Level</option>
                                <option value="100">100 Level</option>
                                <option value="200">200 Level</option>
                                <option value="300">300 Level</option>
                                <option value="400">400 Level</option>
                            </select>
                        </div>

                        <div>
                            <Label className="mb-1">Create a Password</Label>
                            <div className="relative">
                                <Input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required />
                                <button type="button" className="absolute right-2 top-2 text-sm text-gray-500 " onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3">
                        <Button type="submit" className="w-full mt-5">
                            Sign up
                        </Button>
                        <p className="text-sm text-center">
                            Already have an account?{" "}
                            <a href="/student/login" className="text-indigo-600 underline">
                                Log in here
                            </a>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
