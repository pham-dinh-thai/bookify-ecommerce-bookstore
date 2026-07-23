type CoverageCardProps = {};

export default function CoverageCard({}: CoverageCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-8"
      style={{ boxShadow: '0 4px 24px rgba(43,53,47,0.07)' }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-3">
        Delivery Coverage
      </h2>
      <p className="text-sm text-gray-600 leading-relaxed">
        We ship to all provinces and cities across Vietnam
      </p>
    </div>
  );
}
