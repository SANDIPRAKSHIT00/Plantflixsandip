"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("normal");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("❌ Signup failed: " + error.message);
      setLoading(false);
      return;
    }

    const user = data.user;
    if (user) {
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          name,
          email,
          role,
        },
      ]);

      if (insertError) {
        alert("⚠️ Failed to save profile: " + insertError.message);
      } else {
        alert("✅ Signup successful!");
        router.push("/auth/login");
      }
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 via-green-200 to-green-300 overflow-hidden px-4 sm:px-0">
      {/* Background Circles */}
      <div className="absolute w-[400px] h-[400px] sm:w-[520px] sm:h-[520px] bg-green-400 rounded-full blur-3xl opacity-30 -top-32 -left-24" />
      <div className="absolute w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] bg-green-600 rounded-full blur-3xl opacity-20 -bottom-24 -right-16" />

      {/* Signup Card */}
      <div className="relative z-10 bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/30 w-full max-w-md p-6 sm:p-10">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-green-700">
          🌿 Create Account
        </h2>
        <h3 className="text-lg sm:text-xl font-semibold text-center mt-1 text-green-500 tracking-wide">
          Plantflix
        </h3>
        <p className="text-center text-gray-500 mt-3 mb-6 text-sm sm:text-base">
          Join us and grow your world 🌱
        </p>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-3">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-800 transition-all text-sm sm:text-base"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-800 transition-all text-sm sm:text-base"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-800 transition-all text-sm sm:text-base"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Choose Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-800 transition-all text-sm sm:text-base"
            >
              <option value="normal">Normal User</option>
              <option value="nursery">Nursery Admin</option>
            </select>
          </div>

          {/* Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
            >
              {loading ? "Signing Up..." : "Create Account"}
            </button>
          </div>
        </form>

        {/* Login link */}
        <p className="text-center mt-6 text-gray-600 text-sm sm:text-base">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-green-600 font-medium hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
