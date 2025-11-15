export default function Hero() {
  return (
    <section className="relative text-center py-30 text-white overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/image/vedio.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="relative z-10 bg-black/20 py-20 px-6 rounded-lg mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Bring Nature to Your Home
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Explore a wide range of indoor & outdoor plants.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="./userDashboard/plants"
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-semibold"
          >
            Shop Now
          </a>
          <a
            href="/userDashboard/about"
            className="bg-white text-green-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
