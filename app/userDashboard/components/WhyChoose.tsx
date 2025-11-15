const reasons = [
  { icon: "🌱", title: "Healthy Plants" },
  { icon: "🚚", title: "Fast Delivery" },
  { icon: "💚", title: "Eco Packaging" },
  { icon: "💬", title: "24x7 Support" },
];

export default function WhyChoose() {
  return (
    <section className="relative py-16 bg-green-50 overflow-hidden w-full">
      {/* Decorative soft circles */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-green-100 rounded-full opacity-15 animate-pulse"></div>

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-green-700 drop-shadow-sm">
          Why Choose Plantflix?
        </h2>

        {/* Reason cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {reasons.map((r, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-green-100 cursor-pointer"
            >
              <div className="text-5xl mb-4">{r.icon}</div>
              <h3 className="text-xl md:text-2xl font-semibold text-green-600">
                {r.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
