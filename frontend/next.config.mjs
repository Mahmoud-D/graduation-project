/** @type {import('next').NextConfig} */
const nextConfig = {
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
