import TermsOfServiceContent from './ui/terms-of-service-content';
import TermsOfServiceHeader from './ui/terms-of-service-header';
import { termsOfServiceSections } from './terms-of-service.data';

export default function TermsOfService() {
  const section = termsOfServiceSections;

  return (
    <div className="bg-[#f7faf5] min-h-screen">
      <TermsOfServiceHeader />

      <TermsOfServiceContent section={section} />
    </div>
  );
}
