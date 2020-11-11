const fs = require("fs");
const fetch = require("node-fetch");
const prettier = require("prettier");

const getDate = new Date().toISOString();

const fetchUrl = "https://api.kurum2.com/posts";
const DOMAIN = "https://kurum2.com";

const formatted = sitemap => prettier.format(sitemap, { parser: "html" });

(async () => {
  console.log('runnnnnnnnnnn');
  const fetchPosts = await fetch(fetchUrl)
    .then(res => res.json())
    .catch(err => console.log(err));

  console.log(`fetchPosts:${fetchPosts}`)
  let postList=[]
  fetchPosts.forEach(post => postList.push(post.id));
console.log(`postList:${postList}`)
  const postListSitemap = `
    ${postList
      .map(id => {
        return `
          <url>
            <loc>${`${DOMAIN}/post/${id}`}</loc>
            <lastmod>${getDate}</lastmod>
          </url>`;
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
      ${postListSitemap}
    </urlset>
  `;

  const formattedSitemap = formatted(generatedSitemap);

  fs.writeFileSync("./public/sitemap/sitemap-posts.xml", formattedSitemap, "utf8");
})();