import { type QrSvgPath } from '../qr';

export function subscribeToOrigin() {
  return () => {};
}

export function getBrowserOrigin() {
  return window.location.origin;
}

export function getServerOrigin() {
  return '';
}

export function resolveAppOrigin(configuredOrigin: string, browserOrigin: string) {
  if (!browserOrigin) return '';
  if (!configuredOrigin) return browserOrigin;

  try {
    const configuredUrl = new URL(configuredOrigin);
    const browserUrl = new URL(browserOrigin);
    const configuredIsLocalhost = isLocalhost(configuredUrl.hostname);
    const browserIsLocalhost = isLocalhost(browserUrl.hostname);

    return configuredIsLocalhost && !browserIsLocalhost
      ? browserOrigin
      : configuredOrigin;
  } catch {
    return browserOrigin;
  }
}

function isLocalhost(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

export function MockQrCode({ qrCode }: { qrCode: QrSvgPath | null }) {
  const size = qrCode?.size ?? 1;
  const quietZone = 4;

  return (
    <svg
      viewBox={`${-quietZone} ${-quietZone} ${size + quietZone * 2} ${size + quietZone * 2}`}
      className="aspect-square w-full rounded-md bg-white p-2"
      aria-label="Mock payment QR code"
    >
      {qrCode ? <path d={qrCode.path} fill="#2b352f" /> : null}
    </svg>
  );
}

export function InfoRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#edf2ee] pb-3">
      <span className="text-sm font-semibold text-[#58615b]">{label}</span>
      <span
        className={
          strong
            ? 'text-right text-lg font-extrabold text-[#a50064]'
            : 'text-right text-sm font-bold text-[#2b352f]'
        }
      >
        {value}
      </span>
    </div>
  );
}

export function Instruction({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg bg-[#f7faf5] p-4">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#a50064]">
        {icon}
      </span>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-1 text-sm leading-5 text-[#58615b]">{text}</p>
      </div>
    </div>
  );
}
