import { defineConfig } from "cypress";
import { configDotenv } from "dotenv";

configDotenv();

export default defineConfig({
  e2e: {
    viewportWidth: 1920,
    viewportHeight: 1080,
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000/",
    env: {
      BASIC_AUTH_USERNAME: process.env.BASIC_AUTH_USERNAME,
      BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD,
    },
  },
});
