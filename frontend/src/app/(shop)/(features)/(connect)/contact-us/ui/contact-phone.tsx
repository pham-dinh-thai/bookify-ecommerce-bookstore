import { Phone } from 'lucide-react';

type ContactPhoneProps = {};

export default function ContactPhone({}: ContactPhoneProps) {
  return (
    <div className="flex flex-col items-center gap-4 group">
      <div className="w-16 h-16 rounded-full bg-[#d4e3ff] flex items-center justify-center transition-transform group-hover:scale-110">
        <Phone size={24} className="text-[#2d5383]" />
      </div>
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-[#58615b] mb-1 font-semibold">
          Voice Connection
        </p>
        <p className="text-[#2b352f] font-semibold text-lg">
          +84 (0) 24 3946 0123
        </p>
      </div>
    </div>
  );
}
