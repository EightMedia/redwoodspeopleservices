// @ts-check
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";

export default defineConfig({
  site: "https://www.redwoodspeopleservices.nl",
  output: "static",
  adapter: vercel(),
  trailingSlash: "ignore",
  integrations: [react(), keystatic(), sitemap({ filter: (page) => !page.includes("/bedankt/") && !page.includes("/keystatic") })],
  vite: { plugins: [tailwindcss()] },
  image: {
    // Vercel's image service is used in production; sharp locally.
  },
  // Oude WordPress-URL's blijven werken
  redirects: {
    "/nieuwe-home/": "/",
    "/webshop/": "/over-ons/",
    "/winkelmand/": "/",
    "/afrekenen/": "/",
    "/mijn-account/": "/",
    "/natuurcoaching/": "/greenwoods/",
    "/programmas-retreats/": "/greenwoods/",
    "/blog-goed-voelen/": "/blog/",
    "/een-fragiel-evenwicht/": "/blog/",
    "/verhaal-over-de-vier-verbindingen/": "/blog/verhaal-over-de-vier-verbindingen/",
    "/e-l-k-a-a-r-vasthouden/": "/blog/e-l-k-a-a-r-vasthouden/",
    "/samen-sterker-in-de-storm/": "/blog/samen-sterker-in-de-storm/",
    "/elementor-9304/": "/blog/samen-door-de-modder/",
    "/schaamte-van-overleving-naar-verbondenheid/": "/blog/schaamte-van-overleving-naar-verbondenheid/",
    "/de-leegte-over-gemis-verbinding-en-de-weg-naar-heling/": "/blog/de-leegte-over-gemis-verbinding-en-de-weg-naar-heling/",
  },
});
