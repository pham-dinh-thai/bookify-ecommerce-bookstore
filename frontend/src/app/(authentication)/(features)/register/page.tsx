'use client';

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, MapPin } from 'lucide-react';
import useForm from '@/hooks/useForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RegisterHeader from './partials/register-header';
import LinkToLogin from './partials/link-to-login';
import RegisterButton from './partials/register-button';
import { registerApi } from '../../api/register.api';
import ErrorMessage from '@/components/error-message';

export default function RegisterContainer() {
  const router = useRouter();

  const { form, setForm, handleChange } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    gender: 'refuse to answer',
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      await registerApi({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        passwordConfirmation: form.confirmPassword,
      });

      router.push('/complete-information');
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Registration failed, try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-7 w-full"
        style={{ boxShadow: '0px 4px 24px rgba(43,53,47,0.08)' }}
      >
        <RegisterHeader
          title="Create an account"
          description="Please fill in the information to create an account"
        />

        {/* First Name */}
        <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#58615b] mb-1.5 block">
          First name
        </label>
        <div className="relative mb-4">
          <User
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aab4ad]"
          />
          <input
            type="text"
            placeholder="Your first name"
            value={form.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="w-full h-[42px] rounded-xl border-[1.5px] border-[#e8ede9] bg-[#f7faf5] pl-9 pr-3 text-[13px] text-[#1a3d2b] outline-none focus:border-[#2d6a4f] focus:bg-white transition-colors"
          />
        </div>

        {/* Last Name */}
        <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#58615b] mb-1.5 block">
          Last name
        </label>
        <div className="relative mb-4">
          <User
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aab4ad]"
          />
          <input
            type="text"
            placeholder="Your last name"
            value={form.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className="w-full h-[42px] rounded-xl border-[1.5px] border-[#e8ede9] bg-[#f7faf5] pl-9 pr-3 text-[13px] text-[#1a3d2b] outline-none focus:border-[#2d6a4f] focus:bg-white transition-colors"
          />
        </div>

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
            placeholder="Email123@example.com"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
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
            onChange={(e) => handleChange('password', e.target.value)}
            className="[&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden w-full h-[42px] rounded-xl border-[1.5px] border-[#e8ede9] bg-[#f7faf5] pl-9 pr-9 text-[13px] text-[#1a3d2b] outline-none focus:border-[#2d6a4f] focus:bg-white transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aab4ad] hover:text-[#58615b]"
          >
            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        {/* Confirm Password */}
        <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#58615b] mb-1.5 block">
          Confirm password
        </label>
        <div className="relative mb-6">
          <Lock
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aab4ad]"
          />
          <input
            type={showConfirmPass ? 'text' : 'password'}
            placeholder="• • • • • • • •"
            value={form.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            className="[&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden w-full h-[42px] rounded-xl border-[1.5px] border-[#e8ede9] bg-[#f7faf5] pl-9 pr-9 text-[13px] text-[#1a3d2b] outline-none focus:border-[#2d6a4f] focus:bg-white transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPass(!showConfirmPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aab4ad] hover:text-[#58615b]"
          >
            {showConfirmPass ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        <ErrorMessage message={errorMessage} />

        <RegisterButton>
          {isSubmitting ? 'Registering...' : 'Register'}
        </RegisterButton>

        {/* Link to Login */}
        <LinkToLogin href="/login" />
      </form>
    </div>
  );
}
