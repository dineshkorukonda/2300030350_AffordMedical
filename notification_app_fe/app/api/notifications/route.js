import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { Log } = require("../../../../logging_middleware");

const API_URL = "http://4.224.186.213/evaluation-service/notifications";

export async function GET(request) {
  await Log("frontend", "info", "api", "fetching notifications");

  const token = process.env.EVALUATION_TOKEN;
  if (!token) {
    await Log("frontend", "error", "config", "token missing");
    return Response.json({ error: "token missing" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const url = new URL(API_URL);
  ["limit", "page", "notification_type"].forEach((key) => {
    const val = searchParams.get(key);
    if (val) url.searchParams.set(key, val);
  });

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      await Log("frontend", "error", "api", `status ${res.status}`);
      return Response.json({ error: "api failed" }, { status: res.status });
    }

    const data = await res.json();
    await Log("frontend", "info", "api", `got ${data.notifications?.length || 0} items`);
    return Response.json(data);
  } catch (err) {
    await Log("frontend", "error", "api", err.message);
    return Response.json({ error: "fetch failed" }, { status: 500 });
  }
}
