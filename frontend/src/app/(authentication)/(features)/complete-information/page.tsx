'use client';

import useForm from '@/hooks/useForm';
import { Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CompleteInformation() {
  const router = useRouter();
  const [error, setError] = useState('');

  const { form, setForm, handleChange } = useForm({
    phoneNumber: '',
    gender: 'refuse to answer',
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

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
        <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#58615b] mb-1.5 block">
          Phone number
        </label>
        <div className="relative mb-4">
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

        {/* Gender */}
        <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#58615b] mb-1.5 block">
          Gender
        </label>
        <select
          value={form.gender}
          onChange={(e) => handleChange('gender', e.target.value)}
          className="w-full h-[42px] rounded-xl border-[1.5px] border-[#e8ede9] bg-[#f7faf5] pl-3 pr-3 text-[13px] text-[#1a3d2b] outline-none focus:border-[#2d6a4f] focus:bg-white transition-colors mb-4"
        >
          <option value="other">other</option>
          <option value="male">male</option>
          <option value="female">female</option>
        </select>

        {/* Provinces */}
        <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#58615b] mb-1.5 block">
          Province
        </label>
        <select
          value={form.gender}
          onChange={(e) => handleChange('gender', e.target.value)}
          className="w-full h-[42px] rounded-xl border-[1.5px] border-[#e8ede9] bg-[#f7faf5] pl-3 pr-3 text-[13px] text-[#1a3d2b] outline-none focus:border-[#2d6a4f] focus:bg-white transition-colors mb-4"
        >
          <option value="hanoi">Hanoi</option>
          <option value="hochiminh">Ho Chi Minh</option>
          <option value="danang">Da Nang</option>
        </select>

        {/* Wards */}
        <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#58615b] mb-1.5 block">
          Ward
        </label>
        <select
          value={form.gender}
          onChange={(e) => handleChange('gender', e.target.value)}
          className="w-full h-[42px] rounded-xl border-[1.5px] border-[#e8ede9] bg-[#f7faf5] pl-3 pr-3 text-[13px] text-[#1a3d2b] outline-none focus:border-[#2d6a4f] focus:bg-white transition-colors mb-4"
        >
          <option value="hanoi">Hoan Kiem</option>
          <option value="hochiminh">Ba Dinh</option>
          <option value="danang">Cau Giay</option>
        </select>

        {/* Street */}
        <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#58615b] mb-1.5 block">
          Street
        </label>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Your street"
            value={form.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            className="w-full h-[42px] rounded-xl border-[1.5px] border-[#e8ede9] bg-[#f7faf5] pl-9 pr-3 text-[13px] text-[#1a3d2b] outline-none focus:border-[#2d6a4f] focus:bg-white transition-colors"
          />
        </div>

        {/* Submit */}
        <button className="w-full h-[42px] bg-[#2d6a4f] text-white text-[13px] font-semibold rounded-xl hover:bg-[#1a3d2b] transition-colors mb-4">
          Register
        </button>
      </form>
    </div>
  );
}
