export type LoginApiRequest = {
  email: string;
  password: string;
};

export type LoginApiResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function loginApi(
  payload: LoginApiRequest,
): Promise<LoginApiResponse> {
  const response = await fetch(`/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  console.log('status:', response.status, 'data:', data);

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  console.log('Login API response:', data);
  return data as LoginApiResponse;
}
