const SERVER = "https://ecommerce.routemisr.com/api";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function api(path, options = {}) {
  const { method = "GET", body, auth = false, version = 1 } = options;

  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (auth) headers.token = getToken();

  const res = await fetch(SERVER + "/v" + version + "/" + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (err) {
    data = null;
  }

  if (!res.ok) {
    const message = (data && (data.message || (data.errors && data.errors.msg))) || "Something went wrong";
    throw new Error(message);
  }
  return data;
}

export function decodeToken(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload));
  } catch (err) {
    return null;
  }
}

export function money(n) {
  return Number(n || 0).toLocaleString("en-US") + " EGP";
}
