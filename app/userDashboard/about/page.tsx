"use client";
import Image from "next/image";
import Navbar from "../components/Navbar";

export default function AboutPage() {
  return (

    <>
    <Navbar />
    <div className="min-h-screen bg-green-50 py-16 px-6 md:px-16">
      {/* Section Container */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Left Content */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-green-700 mb-6">
            About <span className="text-green-500">Plantflix</span>
          </h1>

          <p className="text-gray-700 leading-relaxed mb-6">
            Welcome to <strong>Plantflix</strong> — your digital companion in the
            world of plants! 🌿  
            We are passionate about making nature a part of everyone’s daily
            life. Whether you’re a home gardener, plant enthusiast, or a nursery
            owner, Plantflix brings together the joy of greenery and the
            convenience of technology.  
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            At Plantflix, our goal is simple: to connect people with plants.
            Explore hundreds of plant varieties, learn care tips, and even buy
            plants directly from trusted nurseries.  
            With a clean design and powerful admin tools, nursery owners can
            manage inventory, track orders, and grow their business efficiently.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            The platform is powered by <strong>Next.js</strong>, <strong>Supabase</strong>, and <strong>TailwindCSS</strong>,
            ensuring a smooth and secure experience.  
            Whether you’re a beginner or a plant expert, Plantflix has something
            for everyone — because we believe every home deserves a little green
            happiness. 🌱
          </p>

          <button className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition">
            Explore Plants
          </button>
        </div>

        {/* Right Image */}
        <div className="flex-1">
          <Image
            src="/image/abot.jfif"
            alt="Green plants background"
            width={600}
            height={400}
            className="rounded-3xl shadow-lg"
          />
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-5xl mx-auto mt-20 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4">
          Our Mission
        </h2>
        <p className="text-gray-700 leading-relaxed mb-8">
          To make plant care easy, accessible, and enjoyable for everyone.  
          We aim to build a community that values sustainability, eco-friendliness,
          and the joy of growing something green.
        </p>

        <Image
          src="/image/underabout.jpg"
          alt="Our Mission"
          width={500}
          height={400}
          className="rounded-2xl shadow-xl mx-auto"
        />
      </div>
    </div>
    </>
    
  );
}
