// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'rewrite-root-to-portal',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // rewrite only exact root requests
          if (req.url === '/' || req.url === '') {
            req.url = '/PortalHousing.html';
          }
          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      // emit PortalHousing.html to dist so preview or static hosting can serve it
      input: {
        portal: resolve(__dirname, 'public/PortalHousing.html')
      }
    }
  }
});