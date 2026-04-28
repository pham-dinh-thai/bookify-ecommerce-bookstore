type PrivacyDataCollectionProps = {};

export default function PrivacyDataCollection({}: PrivacyDataCollectionProps) {
  return (
    <section className="mb-16 bg-white rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Data Collection</h2>

      <div className="space-y-8">
        {/* Direct Engagement */}
        <div>
          <h3 className="text-lg font-semibold text-[#2d6a4f] uppercase tracking-wider mb-3">
            Direct Engagement
          </h3>
          <p className="text-gray-700 leading-relaxed">
            We collect information you provide when creating an account,
            subscribing to our journal, or placing an order. This includes your
            name, shipping address, and email correspondence.
          </p>
        </div>

        {/* Digital Fingerprints */}
        <div>
          <h3 className="text-lg font-semibold text-[#2d6a4f] uppercase tracking-wider mb-3">
            Digital Fingerprints
          </h3>
          <p className="text-gray-700 leading-relaxed">
            To improve our curation experience, we collect non-identifying
            technical data such as browser type, time spent on specific
            curations, and navigation paths through our archives.
          </p>
        </div>
      </div>
    </section>
  );
}
