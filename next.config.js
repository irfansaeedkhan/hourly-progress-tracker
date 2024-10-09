/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  // Suppress specific warnings
  onDemandEntries: {
    // Ignore specific attributes added by browser extensions
    ignoreWarnings: [
      { message: /Extra attributes from the server/ },
    ],
  },
}

module.exports = nextConfig