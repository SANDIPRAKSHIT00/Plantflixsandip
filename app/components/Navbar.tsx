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

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

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
      } else setUser(null);
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("Logged out successfully!");
    router.push("/");
  };

  const handleProfileClick = () => {
    if (!user) router.push("/auth/login");
    else setProfileMenuOpen(!profileMenuOpen);
  };

  return (
    <nav className="bg-[#0f5132] text-white px-6 py-3 flex items-center justify-between shadow-xl border-b border-[#d4af3740] relative z-50">
      
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wide flex items-center gap-2">
        <span className="text-[#d4af37] text-3xl">🌿</span>
        <span className="font-semibold">Plantflix</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4 relative">
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search plants..."
          className="w-64 px-3 py-1.5 rounded bg-white/10 text-white border border-[#d4af3725]
                     placeholder-white/70 backdrop-blur-sm
                     focus:ring-2 focus:ring-[#d4af37] outline-none transition"
        />

        {/* Profile Button */}
        <div className="relative">
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 px-4 py-1.5 rounded 
                       bg-[#d4af37] text-black font-semibold 
                       hover:bg-[#b8962f] transition"
          >
            <MdAccountCircle size={24} />
            {user ? user.name : "Login / Signup"}
          </button>

          {/* Dropdown */}
          {profileMenuOpen && user && (
            <div
              className="absolute right-0 mt-2 w-40 bg-[#0f5132] text-white
              border border-[#d4af37] rounded shadow-xl py-2"
            >
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-[#d4af3720]"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Icon */}
      <button
        className="md:hidden text-3xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#0f5132] text-white 
                        flex flex-col items-center gap-4 py-4 shadow-xl border-t border-[#d4af37] md:hidden">

          <input
            type="text"
            placeholder="Search plants..."
            className="w-11/12 px-3 py-2 rounded bg-white/10 text-white 
                       placeholder-white/70 border border-[#d4af3725]
                       focus:ring-2 focus:ring-[#d4af37] outline-none"
          />

          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 px-4 py-2 rounded 
                       bg-[#d4af37] text-black font-semibold hover:bg-[#b8962f] transition"
          >
            <MdAccountCircle size={22} />
            {user ? user.name : "Login / Signup"}
          </button>

          {user && (
            <button
              onClick={handleLogout}
              className="text-red-300 font-medium mt-2 hover:text-red-400"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
