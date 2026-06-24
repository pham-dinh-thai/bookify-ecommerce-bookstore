'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Phone,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useToast } from '@/shared/common/toast/toast';
import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import {
  readCartItems,
  StoredCartItem,
  writeCartItems,
} from '../cart/cart-storage';
import { findMyContactInfoService } from '../account/services/contact-info.service';
import { MyAddress, MyContactInfo } from '../account/types';
import { clearCheckoutItems, readCheckoutItems } from './checkout-storage';
import {
  PaymentMethod,
  createVnpayPaymentService,
  placeOrderService,
} from './checkout.service';

type AddressMode = 'saved' | 'custom';

const paymentOptions: { value: PaymentMethod; label: string }[] = [
  { value: 'cash_on_delivery', label: 'Cash On Delivery' },
  { value: 'e_wallet', label: 'VNPay' },
];

const phoneNumberRegex = /^(\+84|0)[3-9]\d{8}$/;

const formatCurrency = (value: number) =>
  `${value.toLocaleString('vi-VN')} VNĐ`;

const formatAddress = (address: MyAddress) =>
  `${address.street}, ${address.wardName}, ${address.provinceName}`;

async function ensureAccessToken(): Promise<boolean> {
  if (getAccessToken()) return true;

  const token = await refreshAccessToken();
  return Boolean(token);
}

export default function CheckoutPage() {
  const router = useRouter();
  const toast = useToast();
  const [items, setItems] = useState<StoredCartItem[]>([]);
  const [contact, setContact] = useState<MyContactInfo | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [addressMode, setAddressMode] = useState<AddressMode>('saved');
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('cash_on_delivery');
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    queueMicrotask(async () => {
      const checkoutItems = readCheckoutItems().filter(
        (item) => item.isAvailable && item.quantity > 0,
      );

      if (!isActive) return;
      setItems(checkoutItems);

      try {
        const hasToken = await ensureAccessToken();
        if (!hasToken) {
          setError('Please log in before checkout.');
          return;
        }

        const data = await findMyContactInfoService();
        if (!isActive) return;

        const defaultAddress =
          data.addresses.find((address) => address.isDefault) ??
          data.addresses[0];

        setContact(data);
        setPhoneNumber(data.phoneNumber ?? '');
        setSelectedAddressId(defaultAddress?.id ?? '');
        setCustomAddress(defaultAddress ? formatAddress(defaultAddress) : '');
        setAddressMode(defaultAddress ? 'saved' : 'custom');
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to load delivery information.';
        setError(message);
      } finally {
        if (isActive) setLoading(false);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  const selectedAddress = useMemo(
    () =>
      contact?.addresses.find((address) => address.id === selectedAddressId) ??
      null,
    [contact, selectedAddressId],
  );

  const shippingAddress =
    addressMode === 'saved' && selectedAddress
      ? formatAddress(selectedAddress)
      : customAddress.trim();

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (items.length === 0) {
      setError('Please select at least one book before checkout.');
      return;
    }

    if (!phoneNumber.trim()) {
      setError('Phone number is required.');
      return;
    }

    if (!phoneNumberRegex.test(phoneNumber.trim())) {
      setError('Phone number must be a valid Vietnamese mobile number.');
      return;
    }

    if (!shippingAddress) {
      setError('Shipping address is required.');
      return;
    }

    setPlacingOrder(true);
    setError(null);

    try {
      const order = await placeOrderService({
        paymentMethod,
        phoneNumber: phoneNumber.trim(),
        shippingAddress,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      const orderedIds = new Set(items.map((item) => item.id));
      writeCartItems(
        readCartItems().filter((item) => !orderedIds.has(item.id)),
      );
      clearCheckoutItems();

      if (paymentMethod === 'e_wallet') {
        const payment = await createVnpayPaymentService(order.orderId);
        toast?.addToast('Order placed. Redirecting to payment...', 'success');
        window.location.href = payment.payUrl;
        return;
      }

      toast?.addToast('Order placed successfully', 'success');
      router.push('/account/orders');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to place order.';
      setError(message);
      toast?.addToast(message, 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#f7faf5] text-[#2b352f]">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Link
          href="/cart"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#3f6754] hover:underline"
        >
          <ArrowLeft size={16} strokeWidth={2.2} />
          Back to Cart
        </Link>

        <header className="mb-8 rounded-lg bg-white p-5 shadow-sm sm:p-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Checkout
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#58615b]">
            Confirm delivery details and review your order before placing it.
          </p>
        </header>

        {loading ? (
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="h-96 animate-pulse rounded-lg bg-[#eff5ef] lg:col-span-7" />
            <div className="h-96 animate-pulse rounded-lg bg-[#eff5ef] lg:col-span-5" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#3f6754]/20 bg-white p-10 text-center">
            <h2 className="text-2xl font-bold">No checkout items</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#58615b]">
              Select books from your cart or use Buy now to start checkout.
            </p>
            <Link
              href="/books"
              className="mt-6 inline-flex rounded-full bg-[#3f6754] px-5 py-3 text-sm font-bold text-[#e6ffef] transition-colors hover:bg-[#335b48]"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid gap-8 lg:grid-cols-12 lg:items-start"
          >
            <div className="space-y-6 lg:col-span-7">
              <section className="rounded-lg bg-[#eff5ef] p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#3f6754]">
                    <Phone size={19} strokeWidth={2.2} />
                  </span>
                  <h2 className="text-xl font-bold">Delivery Contact</h2>
                </div>

                <label className="block space-y-2">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#58615b]">
                    Phone Number
                  </span>
                  <input
                    value={phoneNumber}
                    readOnly
                    className="w-full cursor-not-allowed rounded-lg border-0 bg-white/70 px-4 py-3 text-[#2b352f] outline-none placeholder:text-[#58615b]/50"
                    placeholder="0901234567"
                    type="tel"
                  />
                </label>
              </section>

              <section className="rounded-lg bg-[#eff5ef] p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#3f6754]">
                    <MapPin size={19} strokeWidth={2.2} />
                  </span>
                  <h2 className="text-xl font-bold">Shipping Address</h2>
                </div>

                {contact && contact.addresses.length > 0 ? (
                  <div className="space-y-3">
                    {contact.addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`flex cursor-pointer gap-3 rounded-lg bg-white p-4 ring-1 transition-colors ${
                          addressMode === 'saved' &&
                          selectedAddressId === address.id
                            ? 'ring-[#3f6754]'
                            : 'ring-transparent hover:ring-[#3f6754]/25'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={
                            addressMode === 'saved' &&
                            selectedAddressId === address.id
                          }
                          onChange={() => {
                            setAddressMode('saved');
                            setSelectedAddressId(address.id);
                          }}
                          className="mt-1"
                        />
                        <span>
                          <span className="block text-sm font-bold">
                            {formatAddress(address)}
                          </span>
                          {address.isDefault ? (
                            <span className="mt-1 inline-flex text-xs font-bold text-[#3f6754]">
                              Default address
                            </span>
                          ) : null}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : null}

                <label className="mt-4 flex cursor-pointer gap-3 rounded-lg bg-white p-4">
                  <input
                    type="radio"
                    name="address"
                    checked={addressMode === 'custom'}
                    onChange={() => setAddressMode('custom')}
                    className="mt-1"
                  />
                  <span className="w-full">
                    <span className="block text-sm font-bold">
                      Use another address
                    </span>
                    <textarea
                      value={customAddress}
                      onFocus={() => setAddressMode('custom')}
                      onChange={(event) => setCustomAddress(event.target.value)}
                      className="mt-3 min-h-24 w-full resize-y rounded-lg border-0 bg-[#f7faf5] px-4 py-3 text-sm text-[#2b352f] outline-none transition-shadow placeholder:text-[#58615b]/50 focus:ring-2 focus:ring-[#3f6754]/35"
                      placeholder="House number, street, ward, province"
                    />
                  </span>
                </label>
              </section>

              <section className="rounded-lg bg-[#eff5ef] p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#3f6754]">
                    <CreditCard size={19} strokeWidth={2.2} />
                  </span>
                  <h2 className="text-xl font-bold">Payment Method</h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {paymentOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg bg-white p-4 ring-1 transition-colors ${
                        paymentMethod === option.value
                          ? 'ring-[#3f6754]'
                          : 'ring-transparent hover:ring-[#3f6754]/25'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === option.value}
                        onChange={() => setPaymentMethod(option.value)}
                      />
                      <span className="text-sm font-bold">{option.label}</span>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6 lg:col-span-5">
              <section className="rounded-lg bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-bold">Order Summary</h2>

                <div className="mt-5 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[64px_1fr] gap-4 rounded-lg bg-[#f7faf5] p-3"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.cover}
                        alt={`${item.title} cover`}
                        className="h-24 w-16 object-cover"
                      />
                      <div className="min-w-0">
                        <p className="font-bold leading-snug">{item.title}</p>
                        <p className="mt-1 text-xs font-medium text-[#58615b]">
                          {item.author}
                        </p>
                        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                          <SummaryMetric
                            label="Qty"
                            value={String(item.quantity)}
                          />
                          <SummaryMetric
                            label="Unit"
                            value={formatCurrency(item.price)}
                          />
                          <SummaryMetric
                            label="Line"
                            value={formatCurrency(item.price * item.quantity)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3 border-t border-[#d7e3d8] pt-5">
                  <div className="flex justify-between text-sm font-semibold text-[#58615b]">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-bold uppercase tracking-[0.16em]">
                      Total
                    </span>
                    <span className="text-2xl font-extrabold text-[#3f6754]">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                </div>

                {error ? (
                  <div className="mt-5 rounded-lg border border-[#a83836]/20 bg-[#fff5f5] px-4 py-3 text-sm font-semibold text-[#67040d]">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={placingOrder}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#3f6754] px-5 py-4 text-sm font-bold text-[#e6ffef] transition-colors hover:bg-[#335b48] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle2 size={18} strokeWidth={2.2} />
                  {placingOrder ? 'Placing Order...' : 'Place Order'}
                </button>
              </section>
            </aside>
          </form>
        )}
      </div>
    </section>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#58615b]/70">
        {label}
      </p>
      <p className="mt-1 break-words text-xs font-bold text-[#2b352f]">
        {value}
      </p>
    </div>
  );
}
