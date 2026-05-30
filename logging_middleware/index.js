const LOG_URL = "http://4.224.186.213/evaluation-service/logs";

async function Log(stack, level, pkg, message) {
  const token = process.env.EVALUATION_TOKEN;

  try {
    const res = await fetch(LOG_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stack: stack,
        level: level,
        package: pkg,
        message: message,
      }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Log failed:", err.message);
  }
}

module.exports = { Log };
