import { useState } from 'react';

export default function useForm<T extends Record<string, any>>(
  initialValues: T,
) {
  const [form, setForm] = useState<T>(initialValues);

  const handleChange = <K extends keyof T>(field: K, value: T[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return { form, setForm, handleChange };
}
