const fs = require("fs");
const globby = require("globby");
const prettier = require("prettier");

const getDate = new Date().toISOString();

const DOMAIN = "https://kurum2.com";

const formatted = sitemap => prettier.format(sitemap, { parser: "html" });


(async () => {
  // console.log('run')
  const pages = await globby([
    // include
    // "**",
    "pages/**/*{.js,.ts}",
    // "pages/**/**/*.js",
    "pages/*{.js,.ts}",
    // "../pages/*.js",
    // exclude
    "!pages/_*.js",
    "!pages/404.js",
    "!pages/hashtag",
    "!pages/post",
    "!pages/user",
  ]);



  const pagesSitemap = `
    ${pages
      .map(page => {
        
        const path = page
          .replace("pages/", "")
          .replace(".js", "")
        //   .replace(".ts", "")
          .replace(/\/index/g, "");
        const routePath = path === "index" ? "" : path;
        return `
          <url>
            <loc>${DOMAIN}/${routePath}</loc>
            <lastmod>${getDate}</lastmod>
          </url>
        `;
      })
      .join("")}
  `;

  const generatedSitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
    >
      ${pagesSitemap}
    </urlset>
  `;

  const formattedSitemap = formatted(generatedSitemap);

  fs.writeFileSync("./public/sitemap/sitemap-static.xml", formattedSitemap, "utf8");
})();