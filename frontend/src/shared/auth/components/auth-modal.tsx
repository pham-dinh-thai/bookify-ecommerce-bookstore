'use client';

import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, LoaderCircle, X } from 'lucide-react';
import { useState } from 'react';
import { signIn } from '@/shared/auth/lib/token-storage';
import { loginService } from '@/app/[locale]/(authentication)/(features)/login/services/login.service';
import ErrorMessage from '@/shared/common/components/error-message';

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const { accessToken } = await loginService({ email, password });
      signIn(accessToken);
      onSuccess();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Login failed, try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#aab4ad] hover:text-[#58615b] transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-[22px] font-bold text-[#1a3d2b] mb-1.5 text-center">
          Welcome back
        </h2>
        <p className="text-[13px] text-[#58615b] mb-6 text-center">
          Please log in to continue
        </p>

        <form onSubmit={handleSubmit}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[42px] rounded-xl border-[1.5px] border-[#e8ede9] bg-[#f7faf5] pl-9 pr-3 text-[13px] text-[#1a3d2b] outline-none focus:border-[#2d6a4f] focus:bg-white transition-colors"
            />
          </div>

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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <p className="text-center text-[13px] text-[#58615b] mt-4">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => {
              onClose();
              router.push('/register');
            }}
            className="text-[#2d6a4f] font-bold hover:opacity-70"
          >
            Register now
          </button>
        </p>
      </div>
    </div>
  );
}
