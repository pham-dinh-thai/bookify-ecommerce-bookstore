import { Mail } from 'lucide-react';

type ContactEmailProps = {};

export default function ContactEmail({}: ContactEmailProps) {
  return (
    <div className="flex flex-col items-center gap-4 group">
      <div className="w-16 h-16 rounded-full bg-[#c1ecd4] flex items-center justify-center transition-transform group-hover:scale-110">
        <Mail size={24} className="text-[#325947]" />
      </div>
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-[#58615b] mb-1 font-semibold">
          Electronic Mail
        </p>
        <p className="text-[#2b352f] font-semibold text-lg">
          bookify@archivist.com
        </p>
      </div>
    </div>
  );
}
