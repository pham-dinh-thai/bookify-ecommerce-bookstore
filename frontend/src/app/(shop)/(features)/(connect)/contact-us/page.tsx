import ContactArchivalHours from './ui/contact-archival-hours';
import ContactEmail from './ui/contact-email';
import ContactPhone from './ui/contact-phone';
import ContactSocial from './ui/contact-social';
import ContactUsHeader from './ui/contact-us-header';

type ContactUsProps = {};

export default function ContactUs({}: ContactUsProps) {
  return (
    <div className="bg-[#f7faf5] min-h-screen">
      <ContactUsHeader />

      <main className="pb-32 px-6 max-w-5xl mx-auto">
        <section className="max-w-2xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <ContactEmail />

            <ContactPhone />

            <ContactSocial />
          </div>

          <ContactArchivalHours />
        </section>
      </main>
    </div>
  );
}
