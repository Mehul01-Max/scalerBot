const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Send a chat message to the backend.
 * @param {string} query — The user's message
 * @returns {Promise<string>} — The assistant's reply text
 */
export async function sendMessage(query) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }

  const data = await res.json();
  // The backend returns { response: { role, content } }
  return data.response?.content ?? data.response;
}

/**
 * Switch the active persona on the backend (resets conversation).
 * @param {string} persona — One of "Anshuman" | "Abhimanyu" | "Kshitij"
 */
export async function changePersona(persona) {
  const res = await fetch(`${API_BASE}/changePersona/${persona}`, {
    method: 'PUT',
  });

  if (!res.ok) {
    throw new Error(`Failed to switch persona: ${res.status}`);
  }

  return res.json();
}
