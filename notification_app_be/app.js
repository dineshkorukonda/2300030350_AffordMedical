require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const { Log } = require("../logging_middleware");

const API_URL = "http://4.224.186.213/evaluation-service/notifications";
const WEIGHT = { Placement: 3, Result: 2, Event: 1 };
const readIds = new Set();
const TOP_N = 10;

function getTopPriority(notifications, n) {
  const unread = notifications.filter((item) => !readIds.has(item.ID));

  return unread
    .sort((a, b) => {
      const wA = WEIGHT[a.Type] || 0;
      const wB = WEIGHT[b.Type] || 0;
      if (wA !== wB) return wB - wA;
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, n);
}

async function main() {
  await Log("backend", "info", "handler", "stage 1 priority inbox started");

  if (!process.env.EVALUATION_TOKEN) {
    await Log("backend", "error", "config", "EVALUATION_TOKEN not found in .env");
    throw new Error("EVALUATION_TOKEN missing in .env file");
  }

  await Log("backend", "debug", "config", "env loaded, token is present");

  await Log("backend", "info", "handler", "calling notifications api");

  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${process.env.EVALUATION_TOKEN}` },
  });

  if (!res.ok) {
    await Log("backend", "error", "handler", `notifications api returned status ${res.status}`);
    throw new Error(`API error: ${res.status}`);
  }

  const { notifications } = await res.json();

  await Log(
    "backend",
    "info",
    "handler",
    `received ${notifications.length} notifications from api`
  );

  const unreadCount = notifications.filter((item) => !readIds.has(item.ID)).length;

  await Log("backend", "debug", "utils", `${unreadCount} unread notifications before sorting`);

  const top = getTopPriority(notifications, TOP_N);

  await Log(
    "backend",
    "info",
    "utils",
    `sorted by Placement>Result>Event and picked top ${TOP_N}`
  );

  console.log(`\nTop ${TOP_N} Priority Notifications\n`);

  top.forEach((item, i) => {
    console.log(`${i + 1}. [${item.Type}] ${item.Message}`);
    console.log(`   ${item.Timestamp}`);
  });

  await Log(
    "backend",
    "info",
    "handler",
    `printed top ${top.length} priority notifications to console`
  );
}

main().catch(async (err) => {
  await Log("backend", "fatal", "handler", err.message);
  console.error(err.message);
  process.exit(1);
});
