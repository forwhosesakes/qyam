import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import { flatRoutes } from "remix-flat-routes";
import { remixDevTools } from "remix-development-tools";

declare module "@remix-run/cloudflare" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy(),
    // remixDevTools(),
    svgr({
      // SVGR options
      svgrOptions: {
        // icon: true, // Optional: if you're using icons
        exportType: 'default', // Use default export
        ref: true, // Optional: if you need ref support
        // typescript:true,
      },
      include: "**/*.svg?react" // This ensures ?react query works
    }),
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
  ssr: {
    noExternal: ['lucide-react', 'react-dropzone'],
},
});
