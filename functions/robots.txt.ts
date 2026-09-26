/// <reference types="@cloudflare/workers-types" />

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);

  // If we are on the production domain, allow indexing but block APIs
  if (url.hostname === "perfxcel.com" || url.hostname === "www.perfxcel.com") {
    return new Response(
      `User-agent: *
Content-Signal: ai-train=yes, search=yes, ai-input=yes
Allow: /
Disallow: /api/
Disallow: /storage/

Sitemap: https://perfxcel.com/sitemap.xml
`,
      {
        headers: { "Content-Type": "text/plain" },
      },
    );
  }

  // Block indexing for dev.perfxcel.com, preview deployments, or any other domain
  return new Response(
    `User-agent: *
Disallow: /
`,
    {
      headers: { "Content-Type": "text/plain" },
    },
  );
};
