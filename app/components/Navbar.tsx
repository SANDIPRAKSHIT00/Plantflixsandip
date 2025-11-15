"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdAccountCircle } from "react-icons/md";
import { FiMenu, FiX } from "react-icons/fi";
import { supabase } from "@/app/lib/supabaseClient";

interface UserProfile {
  id: string;
  email?: string;
  name?: string | null;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const router = useRouter();

  // ✅ Fetch current user & profile (name)
  useEffect(() => {
    const fetchUserAndRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", user.id)
          .single();

        setUser({
          id: user.id,
          email: user.email ?? "",
          name: profile?.name ?? "User",
        });
      } else {
        setUser(null);
      }
    };

    fetchUserAndRole();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUserAndRole();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ✅ Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("🚪 Logged out successfully!");
    setProfileMenuOpen(false);
    router.push("/");
  };

  // ✅ Handle Profile Icon Click
  const handleProfileClick = () => {
    if (!user) {
      router.push("/auth/login");
    } else {
      setProfileMenuOpen(!profileMenuOpen);
    }
  };

  return (
    <nav className="bg-green-300 text-white p-4 flex items-center justify-between relative z-50">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold tracking-wide">🌿 Plantflix</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-3 relative">
        <input
          type="text"
          placeholder="Search plants..."
          className="w-48 md:w-64 px-2 py-1 rounded border border-white/50 text-black 
                     focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Profile Icon */}
        <div className="relative">
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 text-white font-semibold 
                       hover:bg-white hover:text-green-600 transition px-3 py-1 rounded"
          >
            <MdAccountCircle size={24} />
            {user ? <span>{user.name}</span> : <span>Login / Signup</span>}
          </button>

          {/* Profile Dropdown */}
          {profileMenuOpen && user && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-green-700 
                            rounded-md shadow-lg py-2">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-green-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-green-200 text-green-900 
                        flex flex-col items-center gap-3 py-4 shadow-lg md:hidden">

          <input
            type="text"
            placeholder="Search plants..."
            className="w-11/12 px-3 py-2 rounded border border-green-400 
                       focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Profile / Login */}
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 font-semibold bg-green-500 
                       text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            <MdAccountCircle size={22} />
            {user ? <span>{user.name}</span> : <span>Login / Signup</span>}
          </button>

          {/* Logout */}
          {user && (
            <button
              onClick={handleLogout}
              className="text-red-600 font-medium mt-2 hover:underline"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
