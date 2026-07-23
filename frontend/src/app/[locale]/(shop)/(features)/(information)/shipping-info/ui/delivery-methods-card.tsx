import { Clock } from 'lucide-react';

type DeliveryMethodsCardProps = {};

export default function DeliveryMethodsCard({}: DeliveryMethodsCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-7 h-full"
      style={{ boxShadow: '0 4px 24px rgba(43,53,47,0.07)' }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Clock size={18} className="text-gray-700" />
        <h2 className="text-xl font-bold text-gray-900">Shipping Methods</h2>
      </div>

      {/* Delivery rows */}
      <div className="divide-y divide-gray-100 mb-8">
        {[
          {
            label: 'Standard Shipping',
            value: '3-5 business days',
          },
          {
            label: 'Express Shipping',
            value: '1-2 business days',
          },
          {
            label: 'Local Pickup',
            value: 'Same day or next day',
          },
        ].map((row) => (
          <div key={row.label} className="flex justify-between py-4 text-sm">
            <span className="text-gray-700">{row.label}</span>
            <span className="font-semibold text-gray-900">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Shipping Costs */}
      <div className="bg-[#f7faf5] rounded-xl p-5 text-left">
        <p className="text-sm font-bold text-gray-700 mb-4">
          50,000 VND Shipping Costs
        </p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white rounded-lg p-4">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
              Standard Shipping
            </p>
            <p className="text-2xl font-bold text-gray-900">
              Free for orders above 500,000 VND
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
              Express Shipping
            </p>
            <p className="text-2xl font-bold text-gray-900">50,000 VND</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 italic">
          * International shipping available upon request with special
          arrangements
        </p>
      </div>
    </div>
  );
}
