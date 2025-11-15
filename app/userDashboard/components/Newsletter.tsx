import { Mail } from "lucide-react";

export default function NewsletterHero() {
  return (
    <section className="relative bg-gradient-to-r from-green-400 to-green-600 text-white py-20 px-4 text-center overflow-hidden">
      {/* Main content */}
      <div className="max-w-2xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
          Join the Plantflix Community 🌿
        </h2>
        <p className="text-lg md:text-xl mb-8 drop-shadow-sm">
          Get exclusive plant care tips, offers, and updates straight to your inbox.
        </p>

        {/* Email input and button */}
        <div className="flex justify-center items-center max-w-md mx-auto shadow-lg rounded-full overflow-hidden">
          <span className="bg-white text-green-600 px-4 py-2 flex items-center border-r border-green-300">
            <Mail className="w-5 h-5 mr-2" />
            Email
          </span>
          <input
            type="email"
            placeholder="Your email address"
            className="border-none px-4 py-2 w-full text-gray-800 focus:outline-none"
          />
          <button className="bg-white text-green-600 font-semibold px-4 py-2 hover:bg-green-100 transition">
            Subscribe
          </button>
        </div>
      </div>

      {/* Decorative floating circles / leaves */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-green-300 rounded-full opacity-15 animate-pulse"></div>
      <div className="absolute top-1/2 right-20 w-32 h-32 bg-green-100 rounded-full opacity-20 animate-pulse"></div>
    </section>
  );
}
