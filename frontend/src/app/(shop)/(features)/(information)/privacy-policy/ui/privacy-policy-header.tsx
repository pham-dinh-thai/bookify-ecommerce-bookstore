type PrivacyPolicyHeaderProps = {};

export default function PrivacyPolicyHeader({}: PrivacyPolicyHeaderProps) {
  const formatDate = (date: string | number | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="mb-12">
      <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">
        INFORMATION MANAGEMENT
      </p>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-600">
        Last Updated: {formatDate(new Date())}
      </p>
    </div>
  );
}
