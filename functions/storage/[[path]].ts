/// <reference types="@cloudflare/workers-types" />

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const supabaseUrl =
    (context.env as any).VITE_SUPABASE_URL || "https://db-dev.dotevolve.net";
  const targetUrl = new URL(url.pathname + url.search, supabaseUrl);

  const newRequest = new Request(targetUrl, context.request);
  // Remove restricted headers
  newRequest.headers.delete("origin");
  newRequest.headers.delete("referer");

  return fetch(newRequest);
};
