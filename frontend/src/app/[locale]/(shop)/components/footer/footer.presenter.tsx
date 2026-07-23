import FooterConnect from './partials/footer-connect';
import FooterCopyright from './partials/footer-copyright';
import FooterDescription from './partials/footer-description';
import FooterInformation from './partials/footer-information';

type FooterProps = {
  appName: string;
  description: string;
  information: string;
  infoLinks: InfoLink[];
  connect: string;
  connectLinks: ConnectLink[];
  copyright: string;
};

export default function FooterPresenter({
  appName,
  description,
  information,
  infoLinks,
  connect,
  connectLinks,
  copyright,
}: FooterProps) {
  return (
    <footer className="bg-[#dff0e0] px-6 md:px-16 pt-10 md:pt-12 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <FooterDescription appName={appName} description={description} />

          <FooterInformation information={information} infoLinks={infoLinks} />

          <FooterConnect connect={connect} connectLinks={connectLinks} />
        </div>

        <FooterCopyright copyright={copyright} />
      </div>
    </footer>
  );
}
