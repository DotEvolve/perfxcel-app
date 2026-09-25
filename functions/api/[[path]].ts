/// <reference types="@cloudflare/workers-types" />

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const apiUrl = (context.env as any).PERFXCEL_API_URL || 'https://api-dev.perfxcel.com';
  const targetUrl = new URL(url.pathname + url.search, apiUrl);
  
  const newRequest = new Request(targetUrl, context.request);
  return fetch(newRequest);
};
