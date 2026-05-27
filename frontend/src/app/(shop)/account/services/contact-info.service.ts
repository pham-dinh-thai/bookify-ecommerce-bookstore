import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { AddressForm, MyContactInfo, PhoneNumberForm } from '../types';

const CONTACT_INFO_ENDPOINT = '/api/my-account/contact-info';
const PHONE_NUMBER_ENDPOINT = '/api/my-account/phone-number';
const ADDRESS_ENDPOINT = '/api/my-account/address';

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

export async function findMyContactInfoService(): Promise<MyContactInfo> {
  const response = await fetch(CONTACT_INFO_ENDPOINT, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as MyContactInfo;
}

export async function updateMyPhoneNumberService(
  payload: PhoneNumberForm,
): Promise<void> {
  const response = await fetch(PHONE_NUMBER_ENDPOINT, {
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

export async function addMyAddressService(
  payload: AddressForm,
): Promise<void> {
  const response = await fetch(ADDRESS_ENDPOINT, {
    method: 'POST',
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

export async function removeMyAddressService(id: string): Promise<void> {
  const response = await fetch(`${ADDRESS_ENDPOINT}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export async function setDefaultMyAddressService(id: string): Promise<void> {
  const response = await fetch(`${ADDRESS_ENDPOINT}/${id}/is-default`, {
    method: 'PATCH',
    credentials: 'include',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}
