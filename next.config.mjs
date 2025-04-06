/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for development
    reactStrictMode: true,

    // Use SWC to minify and optimize code
    swcMinify: true,

    // Compiler options for additional optimizations
    compiler: {
        // Remove console logs in production
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // Image optimization
    images: {
        // Support modern formats
        formats: ['image/avif', 'image/webp'],
        // Define device sizes for responsive images
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        // Add placeholder blur option
        minimumCacheTTL: 60,
        // Domains for remote images (add your remote image domains if any)
        domains: [],
    },

    // Performance optimization
    experimental: {
        // Enable optimizations for modern browsers
        optimizeCss: true,
        // Cache compilation output to improve build times for future builds
        turbotrace: {
            // Use modern JS output (ES6+)
            logLevel: 'warn',
        },
        // Optimize font loading
        fontLoaders: [
            { loader: '@next/font/google', options: { subsets: ['latin'] } },
        ],
    },

    // Static optimization
    poweredByHeader: false,

    // Add proper caching headers
    async headers() {
        return [
            {
                // Match all request paths
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, stale-while-revalidate=60',
                    },
                ],
            },
            {
                // Cache policy for static assets
                source: '/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                // Cache policy for images
                source: '/images/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=86400, stale-while-revalidate=600',
                    },
                ],
            },
            {
                // Cache policy for fonts
                source: '/fonts/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },

    // Optimized webpack configuration
    webpack: (config, { dev, isServer }) => {
        // Only run in production builds
        if (!dev) {
            // Split chunks more aggressively
            config.optimization.splitChunks = {
                chunks: 'all',
                minSize: 20000,
                maxSize: 90000,
                cacheGroups: {
                    default: false,
                    vendors: false,
                    framework: {
                        name: 'framework',
                        test: /[\\/]node_modules[\\/](@next|next|react|framer-motion)[\\/]/,
                        priority: 40,
                        chunks: 'all',
                        enforce: true,
                    },
                    lib: {
                        test: /[\\/]node_modules[\\/](?!(@next|next|react|framer-motion)[\\/])/,
                        name(module, chunks) {
                            const packageName = module.context.match(
                                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                            )[1];
                            return `npm.${packageName.replace('@', '')}`;
                        },
                        priority: 30,
                        minChunks: 1,
                        reuseExistingChunk: true,
                    },
                    styles: {
                        name: 'styles',
                        test: /\.(css|scss|sass)$/,
                        chunks: 'all',
                        enforce: true,
                    },
                },
            };
        }

        return config;
    },
};

export default nextConfig;