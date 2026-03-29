const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

interface LINEUser {
  userId: string;
}

export async function sendLINEAlert(message: string): Promise<void> {
  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    console.error("LINE_CHANNEL_ACCESS_TOKEN not set");
    return;
  }

  try {
    await fetch("https://api.line.me/v2/bot/message/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        messages: [
          {
            type: "text",
            text: message,
          },
        ],
      }),
    });
  } catch (error) {
    console.error("Failed to send LINE alert:", error);
  }
}

export async function sendLINEPushMessage(userId: string, message: string): Promise<void> {
  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    console.error("LINE_CHANNEL_ACCESS_TOKEN not set");
    return;
  }

  try {
    await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: userId,
        messages: [
          {
            type: "text",
            text: message,
          },
        ],
      }),
    });
  } catch (error) {
    console.error("Failed to send LINE push message:", error);
  }
}
