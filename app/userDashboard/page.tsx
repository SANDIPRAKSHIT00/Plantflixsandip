"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedPlants from "./components/FeaturedPlants";
import Categories from "./components/Categories";
import WhyChoose from "./components/WhyChoose";
import Testimonials from "./components/Testimonials";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeaturedPlants />
      <Categories />
      <WhyChoose />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
}
