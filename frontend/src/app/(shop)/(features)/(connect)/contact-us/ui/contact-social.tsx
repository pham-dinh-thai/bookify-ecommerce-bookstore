import { AtSign } from 'lucide-react';

type ContactSocialProps = {};

export default function ContactSocial({}: ContactSocialProps) {
  return (
    <div className="flex flex-col items-center gap-4 group">
      <div className="w-16 h-16 rounded-full bg-[#c1ecd4]/40 flex items-center justify-center transition-transform group-hover:scale-110">
        <AtSign size={24} className="text-[#3f6754]" />
      </div>
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-[#58615b] mb-1 font-semibold">
          Instagram
        </p>
        <p className="text-[#2b352f] font-semibold text-lg">@th41.0515</p>
      </div>
    </div>
  );
}
