import { loginApi } from '@/app/(authentication)/api/login.api';
import { saveTokens } from '@/app/(authentication)/lib/token-storage';
import useForm from '@/hooks/useForm';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useLoginForm() {
  const router = useRouter();
  const { form, setForm } = useForm({
    email: '',
    password: '',
    remember: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const { accessToken, refreshToken } = await loginApi({
        email: form.email,
        password: form.password,
      });
      saveTokens(accessToken, refreshToken, form.remember);
      router.push('/');
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Login failed, try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return { form, setForm, isSubmitting, errorMessage, handleSubmit };
}
