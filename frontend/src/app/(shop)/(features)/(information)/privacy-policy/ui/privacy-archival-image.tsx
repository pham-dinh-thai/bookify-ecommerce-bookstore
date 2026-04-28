import privacyImg from '../../assets/images/privacy.jpg';
import Image from 'next/image';

type PrivacyArchivalImageProps = {
  alt: string;
};

export default function PrivacyArchivalImage({
  alt,
}: PrivacyArchivalImageProps) {
  return (
    <section className="mb-16">
      <div className="relative rounded-lg overflow-hidden h-100 bg-gray-800 flex items-center justify-center">
        <Image
          src={privacyImg}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}
