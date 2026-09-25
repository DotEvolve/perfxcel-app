/// <reference types="@cloudflare/workers-types" />

export const onRequest: PagesFunction = async (context) => {
  const hostname = 'https://perfxcel.com';
  
  // Define all the static routes of the application
  const staticRoutes = [
    '',
    '/courses',
    '/about',
    '/training-plan',
    '/verify',
    '/contact',
    '/privacy',
    '/terms',
    '/cookies'
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add static routes
  for (const route of staticRoutes) {
    sitemap += `  <url>
    <loc>${hostname}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>
`;
  }

  // Fetch dynamic courses from Supabase
  try {
    const supabaseUrl = (context.env as any).VITE_SUPABASE_URL || 'https://db-dev.dotevolve.net';
    const supabaseKey = (context.env as any).VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      // Fetch active courses with slug, id, and updated_at
      const response = await fetch(`${supabaseUrl}/rest/v1/courses?select=id,slug,updated_at&is_active=eq.true`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const courses = await response.json() as any[];
        for (const course of courses) {
          const pathParam = course.slug || course.id;
          sitemap += `  <url>
    <loc>${hostname}/courses/${pathParam}</loc>
    <lastmod>${new Date(course.updated_at || Date.now()).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`;
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch dynamic courses for sitemap', error);
  }

  sitemap += `</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
