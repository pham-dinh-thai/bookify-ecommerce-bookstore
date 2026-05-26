import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { BasicInfoForm, EmailForm, MyBasicInfo } from '../types';

const BASIC_INFO_ENDPOINT = '/api/my-account/basic-info';
const EMAIL_ENDPOINT = '/api/my-account/email';

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

function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function findMyBasicInfoService(): Promise<MyBasicInfo> {
  const response = await fetch(BASIC_INFO_ENDPOINT, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as MyBasicInfo;
}

export async function updateMyBasicInfoService(
  payload: BasicInfoForm,
): Promise<void> {
  const response = await fetch(BASIC_INFO_ENDPOINT, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export async function updateMyEmailService(payload: EmailForm): Promise<void> {
  const response = await fetch(EMAIL_ENDPOINT, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}
