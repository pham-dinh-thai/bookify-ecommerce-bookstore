import { Lock } from 'lucide-react';

type PrivacySecurityStorageProps = {};

export default function PrivacySecurityStorage({}: PrivacySecurityStorageProps) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Security & Storage
      </h2>
      <p className="text-gray-700 leading-relaxed mb-6">
        Data is stored using industry-standard encryption protocols. We do not
        sell your personal information to third parties; we are archivists, not
        brokers. Your data is used solely to facilitate the delivery of
        literature and to personalize your browsing experience.
      </p>

      <div className="flex-1 bg-green-50 border-l-4 flex items-center gap-2 border-[#2d6a4f] p-4 rounded">
        <Lock></Lock>
        <p className="text-teal-900 flex-1 text-sm">
          We utilize AES-256 encryption for all sensitive stored data and
          SSL/TLS for all data in transit.
        </p>
      </div>
    </section>
  );
}
