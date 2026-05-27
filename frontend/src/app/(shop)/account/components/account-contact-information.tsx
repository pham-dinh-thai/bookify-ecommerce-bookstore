'use client';

import {
  CheckCircle2,
  MapPin,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Star,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { FormEvent } from 'react';
import { useMyContactInfo } from '../hooks/use-my-contact-info';
import AccountSidebar from './account-sidebar';

export default function AccountContactInformation() {
  const {
    addAddress,
    addingAddress,
    addressError,
    addressForm,
    contact,
    deletingAddressId,
    error,
    isPhoneDirty,
    loading,
    loadingWards,
    locationError,
    phoneError,
    phoneForm,
    provinces,
    removeAddress,
    resetAddressForm,
    resetPhoneForm,
    retry,
    savePhoneNumber,
    savingPhone,
    setDefaultAddress,
    settingDefaultAddressId,
    updateAddressField,
    updatePhoneField,
    wards,
  } = useMyContactInfo();

  const handlePhoneSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await savePhoneNumber();
  };

  const handleAddressSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addAddress();
  };

  return (
    <section className="min-h-screen bg-[#f7faf5] text-[#2b352f]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:gap-14 lg:px-8 lg:py-14">
        <AccountSidebar activeItem="contact-information" />

        <div className="min-w-0 flex-1">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#2b352f] sm:text-5xl">
              Contact Information
            </h1>
          </header>

          {loading ? (
            <div className="w-full max-w-3xl rounded-lg bg-[#eff5ef] p-5 shadow-sm sm:p-8">
              <div className="space-y-5">
                <div className="h-24 animate-pulse rounded-lg bg-white/70" />
                <div className="h-48 animate-pulse rounded-lg bg-white/70" />
                <div className="h-28 animate-pulse rounded-lg bg-white/70" />
              </div>
            </div>
          ) : error && !contact ? (
            <div className="w-full max-w-2xl rounded-lg border border-[#a83836]/20 bg-white p-6">
              <h2 className="text-xl font-bold text-[#2b352f]">
                Contact details unavailable
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#58615b]">{error}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={retry}
                  className="rounded-full bg-[#3f6754] px-5 py-2.5 text-sm font-bold text-[#e6ffef] transition-colors hover:bg-[#335b48]"
                >
                  Try again
                </button>
                <Link
                  href="/login"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#3f6754] ring-1 ring-[#3f6754]/20 transition-colors hover:bg-[#f7faf5]"
                >
                  Log in
                </Link>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-3xl space-y-7">
              <form
                className="rounded-lg bg-[#eff5ef] p-5 shadow-sm sm:p-8"
                onSubmit={handlePhoneSubmit}
              >
                <div className="mb-6 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#3f6754]">
                    <Phone size={19} strokeWidth={2.2} />
                  </span>
                  <h2 className="text-xl font-bold text-[#2b352f]">
                    Phone Number
                  </h2>
                </div>

                {phoneError && (
                  <div className="mb-5 rounded-lg border border-[#a83836]/20 bg-white px-4 py-3 text-sm font-semibold text-[#67040d]">
                    {phoneError}
                  </div>
                )}

                <label className="block space-y-2">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#58615b]">
                    Mobile Number
                  </span>
                  <input
                    value={phoneForm.phoneNumber}
                    onChange={(event) => updatePhoneField(event.target.value)}
                    className="w-full rounded-lg border-0 bg-[#e2eae3] px-4 py-3 text-[#2b352f] outline-none transition-shadow placeholder:text-[#58615b]/50 focus:ring-2 focus:ring-[#3f6754]/35"
                    placeholder="0901234567"
                    type="tel"
                  />
                </label>

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={resetPhoneForm}
                    disabled={!isPhoneDirty || savingPhone}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#3f6754] ring-1 ring-[#3f6754]/20 transition-colors hover:bg-[#f7faf5] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RotateCcw size={16} strokeWidth={2.2} />
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={!isPhoneDirty || savingPhone}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3f6754] px-6 py-3 text-sm font-bold text-[#e6ffef] shadow-sm transition-colors hover:bg-[#335b48] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={16} strokeWidth={2.2} />
                    {savingPhone ? 'Saving...' : 'Update Phone'}
                  </button>
                </div>
              </form>

              <form
                className="rounded-lg bg-[#eff5ef] p-5 shadow-sm sm:p-8"
                onSubmit={handleAddressSubmit}
              >
                <div className="mb-6 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#3f6754]">
                    <MapPin size={19} strokeWidth={2.2} />
                  </span>
                  <h2 className="text-xl font-bold text-[#2b352f]">
                    Add Address
                  </h2>
                </div>

                {(addressError || locationError) && (
                  <div className="mb-5 rounded-lg border border-[#a83836]/20 bg-white px-4 py-3 text-sm font-semibold text-[#67040d]">
                    {addressError ?? locationError}
                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#58615b]">
                      Province
                    </span>
                    <select
                      value={addressForm.provinceCode}
                      onChange={(event) =>
                        updateAddressField('provinceCode', event.target.value)
                      }
                      className="w-full rounded-lg border-0 bg-[#e2eae3] px-4 py-3 text-[#2b352f] outline-none transition-shadow focus:ring-2 focus:ring-[#3f6754]/35"
                    >
                      <option value="">Select province</option>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block space-y-2">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#58615b]">
                      Ward
                    </span>
                    <select
                      value={addressForm.wardCode}
                      onChange={(event) =>
                        updateAddressField('wardCode', event.target.value)
                      }
                      disabled={!addressForm.provinceCode || loadingWards}
                      className="w-full rounded-lg border-0 bg-[#e2eae3] px-4 py-3 text-[#2b352f] outline-none transition-shadow focus:ring-2 focus:ring-[#3f6754]/35 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="">
                        {loadingWards ? 'Loading wards...' : 'Select ward'}
                      </option>
                      {wards.map((ward) => (
                        <option key={ward.code} value={ward.code}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block space-y-2 md:col-span-2">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#58615b]">
                      Street
                    </span>
                    <input
                      value={addressForm.street}
                      onChange={(event) =>
                        updateAddressField('street', event.target.value)
                      }
                      className="w-full rounded-lg border-0 bg-[#e2eae3] px-4 py-3 text-[#2b352f] outline-none transition-shadow placeholder:text-[#58615b]/50 focus:ring-2 focus:ring-[#3f6754]/35"
                      placeholder="House number and street"
                      type="text"
                    />
                  </label>
                </div>

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={resetAddressForm}
                    disabled={addingAddress}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#3f6754] ring-1 ring-[#3f6754]/20 transition-colors hover:bg-[#f7faf5] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RotateCcw size={16} strokeWidth={2.2} />
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={addingAddress}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3f6754] px-6 py-3 text-sm font-bold text-[#e6ffef] shadow-sm transition-colors hover:bg-[#335b48] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus size={16} strokeWidth={2.2} />
                    {addingAddress ? 'Adding...' : 'Add Address'}
                  </button>
                </div>
              </form>

              <div className="rounded-lg bg-[#eff5ef] p-5 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-[#2b352f]">
                    Saved Addresses
                  </h2>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#58615b]">
                    {contact?.addresses.length ?? 0}
                  </span>
                </div>

                {contact?.addresses.length ? (
                  <div className="space-y-4">
                    {contact.addresses.map((address) => (
                      <article
                        key={address.id}
                        className="rounded-lg bg-white p-4 ring-1 ring-[#d7e3d8]"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              {address.isDefault && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#c1ecd4] px-3 py-1 text-xs font-bold text-[#325947]">
                                  <CheckCircle2 size={13} strokeWidth={2.2} />
                                  Default
                                </span>
                              )}
                              <span className="text-xs font-semibold text-[#58615b]">
                                {address.wardName}, {address.provinceName}
                              </span>
                            </div>
                            <p className="break-words text-sm font-bold leading-6 text-[#2b352f]">
                              {address.street}
                            </p>
                          </div>

                          <div className="flex shrink-0 flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setDefaultAddress(address.id)}
                              disabled={
                                address.isDefault ||
                                settingDefaultAddressId === address.id ||
                                Boolean(deletingAddressId)
                              }
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f7faf5] text-[#3f6754] transition-colors hover:bg-[#c1ecd4] disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label="Set default address"
                              title="Set default address"
                            >
                              <Star size={16} strokeWidth={2.2} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeAddress(address.id)}
                              disabled={
                                deletingAddressId === address.id ||
                                Boolean(settingDefaultAddressId)
                              }
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fff7f5] text-[#a83836] transition-colors hover:bg-[#fde4dd] disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label="Remove address"
                              title="Remove address"
                            >
                              <Trash2 size={16} strokeWidth={2.2} />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg bg-white p-5 text-sm font-semibold text-[#58615b] ring-1 ring-[#d7e3d8]">
                    No saved addresses yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
