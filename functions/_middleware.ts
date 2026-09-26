/// <reference types="@cloudflare/workers-types" />

export const onRequest: PagesFunction = async (context) => {
  const { request, next, env } = context;
  const accept = request.headers.get("Accept") || "";

  if (accept.includes("text/markdown")) {
    const url = new URL(request.url);
    url.pathname = "/llms.txt";
    const mdResponse = await env.ASSETS.fetch(
      new Request(url.toString(), request),
    );

    if (mdResponse.ok) {
      const newResponse = new Response(mdResponse.body, mdResponse);
      newResponse.headers.set("Content-Type", "text/markdown; charset=utf-8");
      return newResponse;
    }
  }

  return next();
};
