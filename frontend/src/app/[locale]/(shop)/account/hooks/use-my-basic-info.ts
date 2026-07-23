'use client';

import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { useToast } from '@/shared/common/toast/toast';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  findMyBasicInfoService,
  updateMyEmailService,
  updateMyBasicInfoService,
} from '../services/basic-info.service';
import { BasicInfoForm, EmailForm, MyBasicInfo } from '../types';

const emptyForm: BasicInfoForm = {
  firstName: '',
  lastName: '',
  gender: 'female',
};

const emptyEmailForm: EmailForm = {
  email: '',
};

async function ensureAccessToken(): Promise<boolean> {
  if (getAccessToken()) return true;

  const token = await refreshAccessToken();
  return Boolean(token);
}

export function useMyBasicInfo() {
  const toast = useToast();
  const [profile, setProfile] = useState<MyBasicInfo | null>(null);
  const [form, setForm] = useState<BasicInfoForm>(emptyForm);
  const [emailForm, setEmailForm] = useState<EmailForm>(emptyEmailForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emailSaving, setEmailSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const isDirty = useMemo(() => {
    if (!profile) return false;

    return (
      form.firstName !== profile.firstName ||
      form.lastName !== profile.lastName ||
      form.gender !== profile.gender
    );
  }, [form, profile]);

  const isEmailDirty = useMemo(() => {
    if (!profile) return false;

    return emailForm.email !== profile.email;
  }, [emailForm.email, profile]);

  const loadBasicInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    setEmailError(null);

    try {
      const hasToken = await ensureAccessToken();
      if (!hasToken) {
        setError('Please log in to manage your account.');
        return;
      }

      const data = await findMyBasicInfoService();
      setProfile(data);
      setForm({
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
      });
      setEmailForm({ email: data.email });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to load account details.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadBasicInfo();
    });
  }, [loadBasicInfo]);

  const updateField = <K extends keyof BasicInfoForm>(
    field: K,
    value: BasicInfoForm[K],
  ): void => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = (): void => {
    if (!profile) return;

    setForm({
      firstName: profile.firstName,
      lastName: profile.lastName,
      gender: profile.gender,
    });
  };

  const updateEmailField = (value: string): void => {
    setEmailForm({ email: value });
  };

  const resetEmailForm = (): void => {
    if (!profile) return;

    setEmailForm({ email: profile.email });
  };

  const saveBasicInfo = async (): Promise<void> => {
    const payload = {
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
    };

    if (!payload.firstName || !payload.lastName) {
      setError('First name and last name are required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const hasToken = await ensureAccessToken();
      if (!hasToken) {
        setError('Please log in to manage your account.');
        return;
      }

      await updateMyBasicInfoService(payload);
      setProfile((current) =>
        current ? { ...current, ...payload } : { ...payload, email: '' },
      );
      setForm(payload);
      toast?.addToast('Information updated', 'success');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to update account details.';
      setError(message);
      toast?.addToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveEmail = async (): Promise<void> => {
    const payload = {
      email: emailForm.email.trim(),
    };

    if (!payload.email) {
      setEmailError('Email is required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setEmailError('Email invalid format.');
      return;
    }

    setEmailSaving(true);
    setEmailError(null);

    try {
      const hasToken = await ensureAccessToken();
      if (!hasToken) {
        setEmailError('Please log in to manage your account.');
        return;
      }

      await updateMyEmailService(payload);
      setProfile((current) =>
        current ? { ...current, email: payload.email } : current,
      );
      setEmailForm(payload);
      toast?.addToast('Email updated', 'success');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to update email.';
      setEmailError(message);
      toast?.addToast(message, 'error');
    } finally {
      setEmailSaving(false);
    }
  };

  return {
    emailError,
    emailForm,
    emailSaving,
    error,
    form,
    isEmailDirty,
    isDirty,
    loading,
    profile,
    resetEmailForm,
    resetForm,
    retry: loadBasicInfo,
    saveBasicInfo,
    saveEmail,
    saving,
    updateEmailField,
    updateField,
  };
}
