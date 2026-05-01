export type LoginApiRequest = {
  email: string;
  password: string;
};

export type LoginApiResponse = {
  accessToken: string;
};

export async function loginService(
  request: LoginApiRequest,
): Promise<LoginApiResponse> {
  const response = await fetch(`/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message[0]
      : data.message;
    throw new Error(message || 'Login failed');
  }

  return data;
}
