import { Province, Ward } from '../types';

export async function getProvinces(): Promise<Province[]> {
  const response = await fetch('https://provinces.open-api.vn/api/v2/');

  if (!response.ok) {
    throw new Error('Unable to load provinces.');
  }

  return (await response.json()) as Province[];
}

export async function getWardsByProvince(
  provinceCode: string,
): Promise<Ward[]> {
  const response = await fetch(
    `https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`,
  );

  if (!response.ok) {
    throw new Error('Unable to load wards.');
  }

  const data = (await response.json()) as { wards?: Ward[] };

  return data.wards ?? [];
}
