const path = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  root: path.resolve(__dirname, "./dev-src"),
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "@terminhtml/bootstrap",
      fileName: format => `@terminhtml-bootstrap.${format}.js`,
    },
    outDir: path.resolve(__dirname, "./dist"),
    rollupOptions: {
      // make sure to externalize deps that shouldn"t be bundled
      // into your library
      external: ["terminhtml"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {},
      },
    },
    sourcemap: true,
  },
  test: {
    coverage: {
      reporter: ["text", "json", "html"],
    },
    include: [
      path.resolve(
        __dirname,
        "./test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"
      ),
    ],
    environment: "jsdom",
  },
});
