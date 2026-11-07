import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
 outputFileTracingIncludes: { '/api/**/*': ['./certs/supabase-ca.crt'] },
 turbopack: { rules: { '*.css': { loaders: ['@tailwindcss/turbopack'], as: '*.css' } } },
};
export default nextConfig;
