import { Globe } from 'lucide-react';

type GlobalAccessCardProps = {};

export default function GlobalAccessCard({}: GlobalAccessCardProps) {
  return (
    <div className="bg-[#2d6a4f] rounded-2xl p-8 text-white">
      <div className="flex items-center gap-3 mb-4">
        <Globe size={28} className="opacity-80" />
        <h2 className="text-xl font-bold">Local Pickup</h2>
      </div>
      <p className="text-sm opacity-75 leading-relaxed">
        Visit our store in Hoan Kiem, Hanoi and pick up your order directly.
      </p>
    </div>
  );
}
