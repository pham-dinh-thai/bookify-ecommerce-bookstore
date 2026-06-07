import qrcode from 'qrcode-generator';

export type QrSvgPath = {
  path: string;
  size: number;
};

export function createQrSvgPath(text: string): QrSvgPath {
  const qr = qrcode(0, 'M');
  qr.addData(text, 'Byte');
  qr.make();

  const size = qr.getModuleCount();
  const rects: string[] = [];

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (qr.isDark(row, col)) {
        rects.push(`M${col},${row}h1v1h-1z`);
      }
    }
  }

  return {
    path: rects.join(''),
    size,
  };
}
