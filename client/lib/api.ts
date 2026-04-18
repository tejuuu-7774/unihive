const BASE_URL = "https://unihive-28tq.onrender.com/api";

export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body?: unknown,
  token?: string
) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}