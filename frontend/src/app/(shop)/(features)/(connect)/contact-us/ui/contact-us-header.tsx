type ContactUsHeaderProps = {};

export default function ContactUsHeader({}: ContactUsHeaderProps) {
  return (
    <header className="pt-40 pb-20 px-6 max-w-5xl mx-auto text-center">
      <span className="font-label text-xs uppercase tracking-widest text-[#3f6754] mb-4 block font-bold">
        Contact Our Store
      </span>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#2b352f] mb-8 leading-tight">
        Connect with the <br />
        <span className="text-[#3f6754] italic font-medium">Bookify</span>
      </h1>
      <p className="text-lg text-[#58615b] max-w-2xl mx-auto leading-relaxed">
        Whether you are seeking a rare first edition or inquiring about our
        curated international collections, our team of bibliophiles is here to
        assist in your literary discovery.
      </p>
    </header>
  );
}
