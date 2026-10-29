// Na `astro build`: laat redirect-routes in de Vercel-config ook matchen mét slash aan het eind.
// Astro schrijft bijv. "^/webshop$"; oude WordPress-URL's eindigen op "/webshop/".
import { readFile, writeFile } from "node:fs/promises";

const file = new URL("../.vercel/output/config.json", import.meta.url);
const config = JSON.parse(await readFile(file, "utf8"));
let n = 0;
for (const route of config.routes ?? []) {
  if (route.headers?.Location && typeof route.src === "string" && route.src.endsWith("$") && !route.src.endsWith("/?$")) {
    route.src = route.src.slice(0, -1) + "/?$";
    n++;
  }
}
// Oude webshop-productpagina's (/product/<naam>/) naar Over ons
config.routes = [{ src: "^/product(?:/.*)?$", headers: { Location: "/over-ons/" }, status: 301 }, ...(config.routes ?? [])];
await writeFile(file, JSON.stringify(config, null, 2));
console.log(`[fix-redirects] ${n} redirect-routes accepteren nu ook een slash aan het eind`);
