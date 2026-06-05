'use client';

import ErrorMessage from '@/shared/common/components/error-message';
import { ArrowRight, KeyRound, LoaderCircle, MailCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { verifyEmailService } from './services/verify-email.service';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const token = searchParams.get('token') ?? '';

  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const normalizedOtp = useMemo(() => otp.replace(/\D/g, '').slice(0, 6), [otp]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      setErrorMessage('Missing email address. Please register again.');
      return;
    }

    if (normalizedOtp.length !== 6) {
      setErrorMessage('Enter the 6-digit verification code.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      await verifyEmailService({
        email,
        otp: normalizedOtp,
      });

      const params = new URLSearchParams();
      if (token) {
        params.set('token', token);
      }

      router.push(`/account/complete-information?${params.toString()}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Email verification failed. Try again.',
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
        <div className="flex justify-center mb-5">
          <div className="h-12 w-12 rounded-full bg-[#eef7f0] text-[#2d6a4f] flex items-center justify-center">
            <MailCheck size={24} />
          </div>
        </div>

        <h1 className="text-[22px] font-bold text-[#1a3d2b] mb-1.5 text-center">
          Verify email
        </h1>
        <p className="text-[13px] text-[#58615b] mb-7 text-center">
          Enter the 6-digit code sent to {email || 'your email'}.
        </p>

        <label className="text-[10px] font-bold tracking-[0.07em] uppercase text-[#58615b] mb-1.5 block">
          Verification code
        </label>
        <div className="relative mb-4">
          <KeyRound
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aab4ad]"
          />
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            value={normalizedOtp}
            onChange={(event) => setOtp(event.target.value)}
            className="w-full h-[42px] rounded-xl border-[1.5px] border-[#e8ede9] bg-[#f7faf5] pl-9 pr-3 text-[15px] font-semibold text-[#1a3d2b] outline-none focus:border-[#2d6a4f] focus:bg-white transition-colors"
          />
        </div>

        <ErrorMessage message={errorMessage} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[42px] bg-[#2d6a4f] text-white text-[13px] font-semibold rounded-xl hover:bg-[#1a3d2b] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <LoaderCircle size={15} className="animate-spin" />
              Verifying...
            </span>
          ) : (
            'Verify email'
          )}
        </button>

        <p className="text-center text-[13px] text-[#58615b] mt-4">
          <Link
            href="/register"
            className="text-[#2d6a4f] font-bold hover:opacity-70 inline-flex items-center gap-1"
          >
            Use another email
            <ArrowRight size={14} />
          </Link>
        </p>
      </form>
    </div>
  );
}
