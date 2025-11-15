const reviews = [
  { name: "Riya", text: "Beautiful and healthy plants! Highly recommend 💚" },
  { name: "Amit", text: "Fast delivery and amazing quality 🌿" },
  { name: "Sonia", text: "My room looks so fresh now! Thank you Plantflix 🌸" },
];

export default function Testimonials() {
  return (
    <section className="relative bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-green-700 dark:via-green-800 dark:to-green-900 py-16 overflow-hidden">
      {/* Section title */}
      <div className="relative z-10 text-center px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-gray-800 dark:text-white tracking-tight">
          What Our Customers Say
        </h2>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out border border-gray-200 dark:border-gray-700"
            >
              <p className="text-lg italic mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                &quot;{r.text}&quot;
              </p>
              <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">
                — {r.name}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative floating circles / leaves */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-green-300 rounded-full opacity-15 animate-pulse"></div>
      <div className="absolute top-1/3 right-20 w-32 h-32 bg-green-100 rounded-full opacity-20 animate-pulse"></div>
    </section>
  );
}
