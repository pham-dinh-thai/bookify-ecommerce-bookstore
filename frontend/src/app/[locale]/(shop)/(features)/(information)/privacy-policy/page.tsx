import PrivacyArchivalImage from './ui/privacy-archival-image';
import PrivacyArchivalRights from './ui/privacy-archival-rights';
import PrivacyDataCollection from './ui/privacy-data-collection';
import PrivacyIntroduction from './ui/privacy-introduction';
import PrivacyPolicyHeader from './ui/privacy-policy-header';
import PrivacySecurityStorage from './ui/privacy-security-storage';

type PrivacyPolicyProps = {};

export default function PrivacyPolicy({}: PrivacyPolicyProps) {
  return (
    <div className="bg-[#f7faf5] py-12 text-justify">
      <div className="max-w-4xl mx-auto px-6">
        <PrivacyPolicyHeader />

        <PrivacyIntroduction />

        <PrivacyDataCollection />

        <PrivacyArchivalRights />

        <PrivacySecurityStorage />

        <PrivacyArchivalImage alt="Archival" />
      </div>
    </div>
  );
}
