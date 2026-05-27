'use client';

import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { useToast } from '@/shared/common/toast/toast';
import { useMemo, useState } from 'react';
import { changeMyPasswordService } from '../services/basic-info.service';
import { ChangePasswordForm } from '../types';

const emptyForm: ChangePasswordForm = {
  oldPassword: '',
  newPassword: '',
  newPasswordConfirmation: '',
};

async function ensureAccessToken(): Promise<boolean> {
  if (getAccessToken()) return true;

  const token = await refreshAccessToken();
  return Boolean(token);
}

export function useChangePassword() {
  const toast = useToast();
  const [form, setForm] = useState<ChangePasswordForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isDirty = useMemo(
    () =>
      Boolean(
        form.oldPassword || form.newPassword || form.newPasswordConfirmation,
      ),
    [form],
  );

  const updateField = <K extends keyof ChangePasswordForm>(
    field: K,
    value: ChangePasswordForm[K],
  ): void => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = (): void => {
    setForm(emptyForm);
    setError(null);
  };

  const savePassword = async (): Promise<void> => {
    const payload = {
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
      newPasswordConfirmation: form.newPasswordConfirmation,
    };

    if (
      !payload.oldPassword ||
      !payload.newPassword ||
      !payload.newPasswordConfirmation
    ) {
      setError('All password fields are required.');
      return;
    }

    if (payload.newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    if (payload.newPassword !== payload.newPasswordConfirmation) {
      setError('New password confirmation does not match.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const hasToken = await ensureAccessToken();
      if (!hasToken) {
        setError('Please log in to change your password.');
        return;
      }

      await changeMyPasswordService(payload);
      setForm(emptyForm);
      toast?.addToast('Password updated', 'success');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to update password.';
      setError(message);
      toast?.addToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return {
    error,
    form,
    isDirty,
    resetForm,
    savePassword,
    saving,
    updateField,
  };
}
