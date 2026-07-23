export type VerifyEmailRequest = {
  email: string;
  otp: string;
};

export async function verifyEmailService(
  request: VerifyEmailRequest,
): Promise<void> {
  const response = await fetch(
    `/api/email/${encodeURIComponent(request.email)}/verify`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp: request.otp }),
    },
  );

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message[0]
      : data.message;
    throw new Error(message || 'Email verification failed');
  }
}
