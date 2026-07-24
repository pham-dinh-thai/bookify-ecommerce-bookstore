import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import type {
  ChatSession,
  ChatSessionDetail,
  CreateSessionResponse,
} from '../types';

const API_BASE = '/api/chat';

async function getErrorMessage(response: Response): Promise<string> {
  const text = await response.text();
  if (!text) return `HTTP error: ${response.status}`;

  try {
    const data = JSON.parse(text) as { message?: string | string[] };
    if (Array.isArray(data.message)) return data.message[0] ?? text;
    return data.message ?? text;
  } catch {
    return text;
  }
}

async function authedFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);

  if (
    options.body &&
    typeof options.body === 'string' &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers.set('Authorization', `Bearer ${refreshed}`);
      response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });
    }
  }

  return response;
}

export async function createSession(
  title?: string,
): Promise<CreateSessionResponse> {
  const response = await authedFetch(API_BASE + '/sessions', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function listSessions(): Promise<ChatSession[]> {
  const response = await authedFetch(API_BASE + '/sessions');

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function getSessionHistory(
  sessionId: string,
): Promise<ChatSessionDetail> {
  const response = await authedFetch(
    `${API_BASE}/sessions/${sessionId}/messages`,
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function sendMessage(
  sessionId: string,
  content: string,
): Promise<{ reply: string }> {
  const response = await authedFetch(
    `${API_BASE}/sessions/${sessionId}/messages`,
    {
      method: 'POST',
      body: JSON.stringify({ content }),
    },
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function deleteSession(sessionId: string): Promise<void> {
  const response = await authedFetch(`${API_BASE}/sessions/${sessionId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export async function updateSessionTitle(
  sessionId: string,
  title: string,
): Promise<void> {
  const response = await authedFetch(`${API_BASE}/sessions/${sessionId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export function sendMessageStream(
  sessionId: string,
  content: string,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (error: Error) => void,
): () => void {
  const token = getAccessToken();
  if (!token) {
    onError(new Error('Not authenticated'));
    return () => {};
  }

  const controller = new AbortController();

  fetch(`${API_BASE}/sessions/${sessionId}/messages/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
    signal: controller.signal,
    credentials: 'include',
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              onDone();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              onChunk(typeof parsed === 'string' ? parsed : parsed.data ?? '');
            } catch {
              onChunk(data);
            }
          }
        }
      }

      onDone();
    })
    .catch((error) => {
      if (error.name !== 'AbortError') {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    });

  return () => controller.abort();
}
