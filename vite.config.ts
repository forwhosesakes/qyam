import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import { flatRoutes } from "remix-flat-routes";

declare module "@remix-run/cloudflare" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },

      ignoredRouteFiles: ['**/*'],
  routes: async defineRoutes => {
    return flatRoutes('routes', defineRoutes)
  },
    }),
    
    tsconfigPaths(),
  ],
  optimizeDeps: {
    include: [
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
      "@radix-ui/react-tooltip",
      "@react-email/components",
    ],
    exclude: ["@remix-run/dev", "@remix-run/server-runtime"],
  },
  build: {
    rollupOptions: {
      external: [/node:.*/, '@remix-run/dev', '@remix-run/server-runtime'],
      output: {
        manualChunks: {
          'radix': [
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-slot',
            '@radix-ui/react-tooltip'
          ],
          'email': ['@react-email/components','@react-email/render'],
        },
      },
    },
    sourcemap: true,
    target: 'esnext',
    minify: 'esbuild',
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
  ssr: {
    noExternal: [
      '@radix-ui/*',
      '@react-email/components',
      'lucide-react',
      'class-variance-authority',
      'clsx',
      '@react-email/render',
      'react-dropzone',
      'tailwind-merge'
    ],
  
},
});
