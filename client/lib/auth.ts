import { apiRequest } from "./api";

export async function getCurrentUser() {
  try {
    const res = await apiRequest("/users/me");
    return res.data;
  } catch {
    return null;
  }
}
