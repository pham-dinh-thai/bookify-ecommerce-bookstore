export async function getProvinces() {
  const response = await fetch('https://provinces.open-api.vn/api/v2/');

  return response.json();
}

export async function getWardsByProvince(provinceCode: string) {
  const response = await fetch(
    `https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`,
  );

  const data = await response.json();

  return data.wards;
}
