"use client";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
    // TODO: Replace with actual API call when backend is ready
      const res = await fakeLogin(email, password);

      if (res.ok) {
        toast.success("Login successful! ✅,Redirecting to dashboard.");
        router.push("/admin/dashboard");
      } else {
        toast.error("Invalid credentials ❌. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md rounded-xl shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-1">
            <span className="text-xl">🕒📩</span>
            <h2 className="text-xl font-bold text-indigo-600">Exam Alert</h2>
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <p>securly log into your account </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-1">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="mb-1">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full mt-3" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center text-sm text-gray-500">
          Forgot password?{" "}
          <Link
            href="/admin/forgot-password"
            className="text-indigo-600 hover:underline ml-1"
          >
            Reset it
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

// 🔸 This simulates an API login for now
async function fakeLogin(email: string, password: string) {
  return new Promise<{ ok: boolean }>((resolve) => {
    setTimeout(() => {
      const isValid = email === "motun@gmail.com" && password === "1234";
      resolve({ ok: isValid });
    }, 1000);
  });
}
