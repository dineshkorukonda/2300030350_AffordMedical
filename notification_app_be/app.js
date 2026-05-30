require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const { Log } = require("../logging_middleware");

const API_URL = "http://4.224.186.213/evaluation-service/notifications";
const WEIGHT = { Placement: 3, Result: 2, Event: 1 };
const readIds = new Set();
const TOP_N = 10;

function getTopPriority(notifications, n) {
  return notifications
    .filter((item) => !readIds.has(item.ID))
    .sort((a, b) => {
      const wA = WEIGHT[a.Type] || 0;
      const wB = WEIGHT[b.Type] || 0;
      if (wA !== wB) return wB - wA;
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, n);
}

async function main() {
  if (!process.env.EVALUATION_TOKEN) {
    throw new Error("EVALUATION_TOKEN missing in .env file");
  }

  Log("backend", "info", "handler", "fetching notifications");

  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${process.env.EVALUATION_TOKEN}` },
  });

  if (!res.ok) {
    Log("backend", "error", "handler", `api failed with ${res.status}`);
    throw new Error(`API error: ${res.status}`);
  }

  const { notifications } = await res.json();
  const top = getTopPriority(notifications, TOP_N);

  Log("backend", "info", "handler", `showing top ${TOP_N} notifications`);

  console.log(`\nTop ${TOP_N} Priority Notifications\n`);

  top.forEach((item, i) => {
    console.log(`${i + 1}. [${item.Type}] ${item.Message}`);
    console.log(`   ${item.Timestamp}`);
  });
}

main().catch((err) => {
  Log("backend", "fatal", "handler", err.message);
  console.error(err.message);
  process.exit(1);
});
