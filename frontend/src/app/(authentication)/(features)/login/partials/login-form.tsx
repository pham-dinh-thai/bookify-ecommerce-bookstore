'use client';

import ErrorMessage from '@/components/error-message';
import { Mail, EyeOff, Eye, Lock, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useLoginForm } from '../hooks/useLoginForm';

type LoginFormProps = {};

export default function LoginForm({}: LoginFormProps) {
  const [showPass, setShowPass] = useState(false);

  const { form, setForm, isSubmitting, errorMessage, handleSubmit } =
    useLoginForm();

  return (
    <form onSubmit={handleSubmit}>
      {/* Email */}
      <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#58615b] mb-1.5 block">
        Email
      </label>
      <div className="relative mb-4">
        <Mail
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aab4ad]"
        />
        <input
          type="text"
          placeholder="email@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full h-[42px] rounded-xl border-[1.5px] border-[#e8ede9] bg-[#f7faf5] pl-9 pr-3 text-[13px] text-[#1a3d2b] outline-none focus:border-[#2d6a4f] focus:bg-white transition-colors"
        />
      </div>

      {/* Password */}
      <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#58615b] mb-1.5 block">
        Password
      </label>
      <div className="relative mb-4">
        <Lock
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aab4ad]"
        />
        <input
          type={showPass ? 'text' : 'password'}
          placeholder="• • • • • • • •"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="[&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden w-full h-[42px] rounded-xl border-[1.5px] border-[#e8ede9] bg-[#f7faf5] pl-9 pr-10 text-[13px] text-[#1a3d2b] outline-none focus:border-[#2d6a4f] focus:bg-white transition-colors"
        />
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aab4ad] hover:text-[#58615b]"
        >
          {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>

      <ErrorMessage message={errorMessage} />

      <div className="flex items-center justify-between mb-5">
        <label className="flex items-center gap-2 text-[12px] text-[#58615b] cursor-pointer">
          <input
            type="checkbox"
            className="accent-[#2d6a4f] w-3.5 h-3.5"
            checked={form.remember}
            onChange={(e) => setForm({ ...form, remember: e.target.checked })}
          />
          Remember me
        </label>

        <Link
          href="/forgot-password"
          className="text-[12px] font-semibold text-[#2d6a4f] hover:opacity-70"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 rounded-full bg-[#2d6a4f] text-white text-[14px] font-bold hover:bg-[#245a41] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <LoaderCircle size={16} className="animate-spin" />
            Logging in...
          </span>
        ) : (
          'Login'
        )}
      </button>
    </form>
  );
}
