"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "@/app/lib/supabaseClient";
import { Loader2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    user_id: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Get logged in user details
  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setFormData((prev) => ({
          ...prev,
          user_id: user.id,
        }));
      }
    }

    fetchUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus("❌ Please fill out all fields.");
      return;
    }

    if (!formData.user_id) {
      setStatus("❌ User not logged in!");
      return;
    }

    setLoading(true);
    setStatus("");

    // 🔥 Insert into Supabase
    const { error } = await supabase.from("create_message").insert([
      {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        user_id: formData.user_id,
      },
    ]);

    setLoading(false);

    if (error) {
      console.log(error);
      setStatus("❌ Something went wrong. Try again.");
      return;
    }

    setStatus("✅ Message sent successfully! Our team will get back to you soon.");

    setFormData({ name: "", email: "", message: "", user_id: formData.user_id });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-6 py-16">
        <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-green-100">
          <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
            Contact Us
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-green-900 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border text-gray-600 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-green-900 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border text-gray-600 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-green-900 font-medium mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                rows={4}
                className="w-full px-4 py-2 border text-gray-600 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                "Send Message"
              )}
            </button>

            {status && (
              <p className="text-center text-green-700 font-medium mt-3">
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
