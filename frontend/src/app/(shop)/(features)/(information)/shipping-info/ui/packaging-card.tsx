import shippingInfo from '../../assets/images/shippingInfo.jpg';
import Image from 'next/image';

type PackagingCardProps = {};

export default function PackagingCard({}: PackagingCardProps) {
  return (
    <div>
      <div className="rounded-xl overflow-hidden h-113 mb-4">
        <Image
          src={shippingInfo}
          alt="Shipping"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-[#e8f0e9] rounded-xl p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">
          Our Packaging Standards
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          All orders are shipped in durable, protective boxes
        </p>
      </div>
    </div>
  );
}
