const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiRequest = async (url: string, method = "GET", body?: unknown) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};