import useForm from '@/shared/common/hooks/use-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { registerService } from '../services/register.service';

export default function useRegisterForm() {
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

      await registerService({
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

  return {
    form,
    handleChange,
    showPass,
    setShowPass,
    showConfirmPass,
    setShowConfirmPass,
    isSubmitting,
    errorMessage,
    handleSubmit,
  };
}
