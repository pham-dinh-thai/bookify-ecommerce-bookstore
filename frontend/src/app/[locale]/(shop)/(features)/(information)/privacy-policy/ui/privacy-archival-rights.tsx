import { Eye, Edit, Trash2 } from 'lucide-react';

type PrivacyArchivalRightsProps = {};

export default function PrivacyArchivalRights({}: PrivacyArchivalRightsProps) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Your Archival Rights
      </h2>
      <p className="text-gray-600 mb-8">
        You maintain full sovereignty over your digital presence within our
        library
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Right to Access */}
        <div className="bg-white rounded-lg p-6 hover:shadow-lg transition">
          <div className="text-[#2d6a4f] mb-4">
            <Eye size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Right to Access
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Request a complete transcript of every data point we hold regarding
            your profile.
          </p>
        </div>

        {/* Right to Rectify */}
        <div className="bg-white rounded-lg p-6 hover:shadow-lg transition">
          <div className="text-[#2d6a4f] mb-4">
            <Edit size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Right to Rectify
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Ensure your archival record is accurate by updating any outdated or
            incorrect information.
          </p>
        </div>

        {/* Right to Erasure */}
        <div className="bg-white rounded-lg p-6 hover:shadow-lg transition">
          <div className="text-[#2d6a4f] mb-4">
            <Trash2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Right to Erasure
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            At any time, you may request the permanent deletion of your data
            from our active servers.
          </p>
        </div>
      </div>
    </section>
  );
}
