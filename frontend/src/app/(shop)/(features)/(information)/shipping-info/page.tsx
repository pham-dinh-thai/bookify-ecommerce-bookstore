import CoverageCard from './ui/coverage-card';
import DeliveryMethodsCard from './ui/delivery-methods-card';
import GlobalAccessCard from './ui/global-access-card';
import PackagingCard from './ui/packaging-card';
import ShippingInfoHeader from './ui/shipping-info-header';

type ShippingInfoProps = {};

export default function ShippingInfo({}: ShippingInfoProps) {
  return (
    <div className="bg-[#f7faf5] min-h-screen py-12 text-justify">
      <div className="max-w-6xl mx-auto px-6">
        <ShippingInfoHeader />

        <section className="mb-16 grid md:grid-cols-2 gap-8 items-start">
          <PackagingCard />
          <DeliveryMethodsCard />
        </section>

        <section className="mb-16 grid md:grid-cols-2 gap-6">
          <CoverageCard />
          <GlobalAccessCard />
        </section>
      </div>
    </div>
  );
}
