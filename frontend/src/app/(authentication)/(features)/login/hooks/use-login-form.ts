import useForm from '@/shared/common/hooks/use-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginService } from '../services/login.service';
import { setAccessToken } from '@/shared/auth/lib/token-storage';

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

      const { accessToken } = await loginService({
        email: form.email,
        password: form.password,
      });

      setAccessToken(accessToken);
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
