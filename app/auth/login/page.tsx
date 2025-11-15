"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("❌ Login failed: " + error.message);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, name")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      alert("⚠️ Couldn't fetch profile info!");
      setLoading(false);
      return;
    }

    if (profile.role === "nursery") {
      router.push("/dashboard");
    } else if (profile.role === "normal") {
      router.push("/userDashboard");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 via-green-200 to-green-300 overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute w-[600px] h-[600px] bg-green-400 rounded-full blur-3xl opacity-30 top-[-100px] left-[-150px]" />
      <div className="absolute w-[400px] h-[400px] bg-green-600 rounded-full blur-3xl opacity-20 bottom-[-120px] right-[-150px]" />

      {/* Login Card */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/30 w-full max-w-md p-8 sm:p-10">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-green-700">
          🌿 Welcome Back
        </h2>
        <h3 className="text-xl sm:text-2xl font-semibold text-center mt-2 text-green-500 tracking-wide">
          Plantflix
        </h3>
        <p className="text-center text-gray-500 mt-4 mb-8">
          Log in to continue your journey 🌱
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-800 transition-all"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-800 transition-all"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center mt-6 text-gray-600">
          Don’t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-green-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
