'use client';

import useForm from '@/shared/common/hooks/use-form';
import { ArrowBigRight, MapPin, MapPinIcon, Phone, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CompleteInformation() {
  const router = useRouter();
  const [error, setError] = useState('');

  const { form, setForm, handleChange } = useForm({
    phoneNumber: '',
    gender: 'refuse to answer',
    province: '',
    ward: '',
    street: '',
  });

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      <form
        onSubmit={(e) => {}}
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
              <option value="hanoi">Hanoi</option>
              <option value="hochiminh">Ho Chi Minh</option>
              <option value="danang">Da Nang</option>
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
              className="w-full h-[42px] rounded-xl border-[1.5px] border-[#e8ede9] bg-[#f7faf5] pl-9 pr-3 text-[13px] text-[#1a3d2b] outline-none focus:border-[#2d6a4f] focus:bg-white transition-colors"
            >
              <option value="hoankiem">Hoan Kiem</option>
              <option value="badinh">Ba Dinh</option>
              <option value="caugiay">Cau Giay</option>
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
