/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // Enabled static export
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
}

export default nextConfig