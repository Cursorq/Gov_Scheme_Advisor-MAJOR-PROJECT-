const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

async function readResponse(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.detail || data.message || 'The advisor service could not complete this request.')
  }
  return data
}

export async function sendMessage({ message, sessionId, language, file }) {
  const body = new FormData()
  body.append('message', message || '')
  body.append('language', language)
  if (sessionId) body.append('session_id', sessionId)
  if (file) body.append('file', file)

  const response = await fetch(`${API_BASE_URL}/assistant/query`, { method: 'POST', body })
  return readResponse(response)
}

export async function confirmProfile({ sessionId, profile, language }) {
  const response = await fetch(`${API_BASE_URL}/assistant/confirm-profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, profile, language }),
  })
  return readResponse(response)
}

export async function getScheme(schemeId) {
  const response = await fetch(`${API_BASE_URL}/schemes/${encodeURIComponent(schemeId)}`)
  return readResponse(response)
}

export async function submitFeedback({ sessionId, rating, language }) {
  const response = await fetch(`${API_BASE_URL}/assistant/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, rating, language }),
  })
  return readResponse(response)
}
