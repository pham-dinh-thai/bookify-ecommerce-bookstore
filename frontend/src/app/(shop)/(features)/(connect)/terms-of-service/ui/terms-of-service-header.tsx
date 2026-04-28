type TermsOfServiceHeaderProps = {};

export default function TermsOfServiceHeader({}: TermsOfServiceHeaderProps) {
  return (
    <header className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <span className="font-label uppercase tracking-widest text-[#3f6754] text-sm font-semibold mb-4 block">
        LEGAL AGREEMENT
      </span>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#2b352f] mb-6">
        Terms of Service
      </h1>
      <p className="text-lg text-[#58615b] max-w-2xl leading-relaxed text-justify">
        Last updated: October 24, 2024. Welcome to Bookify. These Terms of
        Service govern your use of our website, mobile application, and all
        associated services. By accessing or using Bookify, you agree to be
        bound by these terms. If you do not agree with any part of these terms,
        please do not use our services.
      </p>
    </header>
  );
}
