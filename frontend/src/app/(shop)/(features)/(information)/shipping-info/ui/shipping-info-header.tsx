type ShippingInfoHeaderProps = {};

export default function ShippingInfoHeader({}: ShippingInfoHeaderProps) {
  return (
    <div className="mb-16">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
        LOGISTICS & DELIVERY
      </p>
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        Shipping Information
      </h1>
      <p className="text-base text-gray-600 max-w-lg leading-relaxed">
        At Bookify, we understand that receiving your literary treasures safely
        and promptly is paramount. Our shipping process is designed with care
        and precision to ensure your books arrive in pristine condition, whether
        you're in Hanoi or anywhere else in Vietnam.
      </p>
    </div>
  );
}
