"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "") {
      toast.error("Please enter your email address.");
      return;
    }
    toast.success("Password reset link sent to your email ✅");
    router.push("/admin/reset-pass");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="max-w-md w-full space-y-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-center text-2xl font-bold">Forgot Password</h2>
        <p className="text-sm text-gray-600 text-center">
          Enter your email to receive a password reset link
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>
      </div>
    </div>
  );
}
