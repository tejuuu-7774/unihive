export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body?: unknown
) {
  const res = await fetch(
    `https://unihive-28tq.onrender.com/api${endpoint}`,
    {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
