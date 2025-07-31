"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ChangePassword() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields before saving.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    // OPTIONAL: You can compare oldPassword with the stored one in localStorage

    // Save new password (for now in localStorage for simplicity)
    localStorage.setItem("adminPassword", newPassword);

    toast.success("Password saved successfully.");
    router.push("/admin/dashboard"); // or wherever you want to go
  };

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-6">
      <header className="flex items-center space-x-2">
        <ArrowLeft
          className="h-5 w-5 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-lg font-bold">Change Password</h1>
      </header>

      <div className="mt-6">
        <Label htmlFor="oldPassword" className="mb-1">
          Old Password
        </Label>
        <Input
          type="password"
          id="oldPassword"
          placeholder="Enter your old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-80"
        />
      </div>

      <div>
        <Label htmlFor="newPassword" className="mb-1">
          New Password
        </Label>
        <Input
          type="password"
          id="newPassword"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-80"
        />
      </div>

      <div>
        <Label htmlFor="confirmPassword" className="mb-1">
          Confirm Password
        </Label>
        <Input
          type="password"
          id="confirmPassword"
          placeholder="Re-enter your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-80"
        />
      </div>

      <Button
        onClick={handleSubmit}
        className="w-80 bg-indigo-600 text-white hover:bg-indigo-700"
      >
        Save Password
      </Button>
    </main>
  );
}
