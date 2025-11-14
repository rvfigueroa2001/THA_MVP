import { defineConfig } from "cypress";

export default defineConfig({
    projectId: "n6b7rg",
    e2e: {
        baseUrl: "https://main.d87k27j2eqtjc.amplifyapp.com/",
        viewportWidth: 1280,
        viewportHeight: 720,
        video: true,
    },
    component: {
        devServer: {
            framework: "react",
            bundler: "vite",
        },
    },
}); 
