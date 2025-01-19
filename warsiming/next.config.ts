/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enabling React Strict Mode for better debugging
  reactStrictMode: true,


  // Disabling ESLint during builds (temporarily, if needed)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disabling TypeScript errors during builds (temporarily, if needed)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Internationalization (i18n) setup
  i18n: {
    locales: ["en", "es"], // Add your supported languages here
    defaultLocale: "en",
  },

  // Enabling experimental features
  experimental: {
    appDir: true, // Enable the `app` directory
  },

  // Output directory for static exports
  output: "standalone", // Useful for Docker builds
};

module.exports = nextConfig;
