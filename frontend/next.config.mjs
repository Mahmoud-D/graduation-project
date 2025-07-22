/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    images: {
      domains: ['localhost'], 

        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            port: `${process.env.port}`,
            pathname: '/uploads/**',
          },
        ],
      },
      
};

export default nextConfig;
