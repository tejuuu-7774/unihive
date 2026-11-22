import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const configuredBase = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!configuredBase) {
    return Response.json(
      { success: false, message: "API server is not configured" },
      { status: 500 }
    );
  }

  const { path } = await context.params;
  const base = configuredBase.replace(/\/$/, "");
  const target = new URL(`${base}/${path.map(encodeURIComponent).join("/")}`);
  target.search = request.nextUrl.search;

  const headers = new Headers();
  for (const name of ["content-type", "cookie", "authorization"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const method = request.method.toUpperCase();
  const body = ["GET", "HEAD"].includes(method)
    ? undefined
    : await request.arrayBuffer();

  try {
    const upstream = await fetch(target, {
      method,
      headers,
      body: body && body.byteLength > 0 ? body : undefined,
      cache: "no-store",
      redirect: "manual",
    });

    const responseHeaders = new Headers();
    const contentType = upstream.headers.get("content-type");
    const contentDisposition = upstream.headers.get("content-disposition");
    const setCookie = upstream.headers.get("set-cookie");
    if (contentType) responseHeaders.set("content-type", contentType);
    if (contentDisposition) responseHeaders.set("content-disposition", contentDisposition);
    if (setCookie) responseHeaders.set("set-cookie", setCookie);

    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      { success: false, message: "The API server is temporarily unavailable" },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
