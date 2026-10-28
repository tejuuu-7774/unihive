const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiUrl = (url: string) => `${BASE_URL}${url}`;

export const assetUrl = (url?: string) => {
  if (!url) return "";
  if (/^(https?:|data:|blob:)/.test(url)) return url;
  return `${BASE_URL}${url}`;
};

export const apiRequest = async (url: string, method = "GET", body?: unknown) => {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    credentials: "include",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};
