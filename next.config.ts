/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'hkbvmuumoboujaucbuoa.supabase.co', // Supabase storage domain
      'encrypted-tbn0.gstatic.com',      // if you use Google images
    ],
  },
};

module.exports = nextConfig;
