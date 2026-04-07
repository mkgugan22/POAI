import { MISTRAL_API_KEY, MISTRAL_AGENT_ID, MISTRAL_AGENT_VERSION, MISTRAL_BASE_URL } from "../constants";

/**
 * Start a brand-new conversation with the Mistral agent.
 * @param {string} userMessage - The user's first message text.
 * @returns {Promise<object>} API response with conversation id + outputs.
 */
export async function startConversation(userMessage) {
  const response = await fetch(`${MISTRAL_BASE_URL}/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      agent_id: MISTRAL_AGENT_ID,
      agent_version: MISTRAL_AGENT_VERSION,
      inputs: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Mistral API Error ${response.status}: ${errBody}`);
  }

  return response.json();
}

/**
 * Append a message to an existing Mistral conversation.
 * @param {string} conversationApiId - The Mistral-side conversation id.
 * @param {string} userMessage - The follow-up user message.
 * @returns {Promise<object>} API response with new outputs.
 */
export async function continueConversation(conversationApiId, userMessage) {
  const response = await fetch(
    `${MISTRAL_BASE_URL}/conversations/${conversationApiId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: [{ role: "user", content: userMessage }],
      }),
    }
  );

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Mistral API Error ${response.status}: ${errBody}`);
  }

  return response.json();
}

/**
 * Unified helper – starts or continues based on whether a Mistral conversation ID exists.
 * @param {string} userMessage
 * @param {string|null} conversationApiId
 */
export async function sendMessage(userMessage, conversationApiId = null) {
  if (conversationApiId) {
    return continueConversation(conversationApiId, userMessage);
  }
  return startConversation(userMessage);
}

/**
 * Extract the assistant text from a Mistral /conversations response.
 * Handles both `outputs` array and `choices` (fallback) shapes.
 * @param {object} data - Raw API response JSON
 * @returns {string}
 */
export function extractResponseText(data) {
  if (data?.outputs?.length) {
    for (const output of data.outputs) {
      if (output.role === "assistant" || output.type === "message") {
        const c = output.content;
        if (typeof c === "string") return c;
        if (Array.isArray(c)) return c.map((x) => x.text || "").join("");
      }
    }
    // fallback: first output content
    const first = data.outputs[0]?.content;
    if (typeof first === "string") return first;
    if (Array.isArray(first)) return first.map((x) => x.text || "").join("");
  }

  // OpenAI-compatible fallback
  if (data?.choices?.[0]?.message?.content) {
    return data.choices[0].message.content;
  }

  return "⚠️ Could not parse response. Please try again.";
}
