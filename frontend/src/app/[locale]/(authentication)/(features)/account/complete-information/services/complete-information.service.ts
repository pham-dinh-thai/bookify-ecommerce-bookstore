export async function completeInformationService(
  token: string,
  request: {
    phoneNumber: string;
    gender: string;
    address: {
      provinceCode: string;
      provinceName: string;
      wardCode: string;
      wardName: string;
      street: string;
    };
  },
): Promise<void> {
  const response = await fetch(
    `/api/customers/complete-information?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    },
  );

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message[0]
      : data.message;
    throw new Error(message || 'Failed to complete information');
  }
}
