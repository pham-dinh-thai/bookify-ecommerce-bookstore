'use client';

import useForm from '@/shared/common/hooks/use-form';
import { ArrowBigRight, MapPin, MapPinIcon, Phone, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { completeInformationService } from './services/complete-information.service';
import ErrorMessage from '@/shared/common/components/error-message';
import { getProvinces, getWardsByProvince } from './services/provinces.service';

type Province = { code: string; name: string };
type Ward = { code: string; name: string };

function CompleteInformationContent() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const { form, setForm, handleChange } = useForm({
    phoneNumber: '',
    gender: 'refuse to answer',
    province: '',
    ward: '',
    street: '',
  });

  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  useEffect(() => {
    getProvinces().then(setProvinces);
  }, []);

  useEffect(() => {
    if (form.province) {
      getWardsByProvince(form.province).then(setWards);
    }
  }, [form.province]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const selectedProvince = provinces.find(
        (p: any) => p.code == form.province,
      );
      const selectedWard = wards.find((w: any) => w.code == form.ward);
      await completeInformationService(token, {
        phoneNumber: form.phoneNumber,
        gender: form.gender,
        address: {
          provinceCode: form.province,
          provinceName: selectedProvince?.name ?? '',
          wardCode: form.ward,
          wardName: selectedWard?.name ?? '',
          street: form.street,
        },
      });
      router.push('/login');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed');
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-7 w-full"
        style={{ boxShadow: '0px 4px 24px rgba(43,53,47,0.08)' }}
      >
        <h1 className="text-[22px] font-bold text-[#1a3d2b] mb-1.5 text-center">
          Complete information
        </h1>
        <p className="text-[13px] text-[#58615b] mb-7 text-center">
          Please fill in the information to create an account
        </p>

        {/* Phone number */}
        <div className="mb-4">
          <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#58615b] mb-1.5 block">
            Phone number
          </label>
          <div className="relative">
            <Phone
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aab4ad]"
            />
            <input
              type="text"
              placeholder="Your phone number"
              value={form.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              className="w-full h-[42px] rounded-xl border-[1.5px] border-[#e8ede9] bg-[#f7faf5] pl-9 pr-3 text-[13px] text-[#1a3d2b] outline-none focus:border-[#2d6a4f] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#58615b] mb-1.5 block">
            Gender
          </label>
          <div className="relative">
            <User
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#58615b] pointer-events-none"
            />
            <select
              value={form.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full h-[42px] rounded-xl border-[1.5px] border-[#e8ede9] bg-[#f7faf5] pl-9 pr-3 text-[13px] text-[#1a3d2b] outline-none focus:border-[#2d6a4f] focus:bg-white transition-colors"
            >
              <option value="other">Other</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {/* Provinces */}
        <div className="mb-4">
          <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#58615b] mb-1.5 block">
            Province
          </label>
          <div className="relative">
            <MapPin
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#58615b] pointer-events-none"
            />
            <select
              value={form.province}
              onChange={(e) => handleChange('province', e.target.value)}
              className="w-full h-[42px] rounded-xl border-[1.5px] border-[#e8ede9] bg-[#f7faf5] pl-9 pr-3 text-[13px] text-[#1a3d2b] outline-none focus:border-[#2d6a4f] focus:bg-white transition-colors"
            >
              <option value="">-- Select province --</option>
              {provinces.map((p: any) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ward */}
        <div className="mb-4">
          <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#58615b] mb-1.5 block">
            Ward
          </label>
          <div className="relative">
            <MapPin
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#58615b] pointer-events-none"
            />
            <select
              value={form.ward}
              onChange={(e) => handleChange('ward', e.target.value)}
              disabled={!form.province}
              className="w-full h-[42px] rounded-xl border-[1.5px] border-[#e8ede9] bg-[#f7faf5] pl-9 pr-3 text-[13px] text-[#1a3d2b] outline-none focus:border-[#2d6a4f] focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">-- Select ward --</option>
              {wards.map((w: any) => (
                <option key={w.code} value={w.code}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Street */}
        <div className="mb-4">
          <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#58615b] mb-1.5 block">
            Street
          </label>
          <div className="relative">
            <MapPinIcon
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aab4ad]"
            />
            <input
              type="text"
              placeholder="Your street"
              value={form.street}
              onChange={(e) => handleChange('street', e.target.value)}
              className="w-full h-[42px] rounded-xl border-[1.5px] border-[#e8ede9] bg-[#f7faf5] pl-9 pr-3 text-[13px] text-[#1a3d2b] outline-none focus:border-[#2d6a4f] focus:bg-white transition-colors"
            />
          </div>
        </div>

        <ErrorMessage message={errorMessage} />

        {/* Submit */}
        <button className="w-full h-[42px] bg-[#2d6a4f] text-white text-[13px] font-semibold rounded-xl hover:bg-[#1a3d2b] transition-colors mt-4">
          Confirm information
        </button>

        <p className="text-center text-[13px] text-[#58615b] mt-4">
          <Link
            href="/login"
            className="text-[#2d6a4f] font-bold hover:opacity-70"
          >
            I would like to complete information later{' '}
            <ArrowBigRight size={14} className="inline-block ml-1" /> Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function CompleteInformation() {
  return (
    <Suspense fallback={null}>
      <CompleteInformationContent />
    </Suspense>
  );
}
