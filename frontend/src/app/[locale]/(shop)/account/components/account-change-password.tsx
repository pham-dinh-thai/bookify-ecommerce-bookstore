'use client';

import { Eye, EyeOff, RotateCcw, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FormEvent, useState } from 'react';
import { useChangePassword } from '../hooks/use-change-password';
import AccountSidebar from './account-sidebar';

type PasswordField = 'oldPassword' | 'newPassword' | 'newPasswordConfirmation';

export default function AccountChangePassword() {
  const t = useTranslations('account.changePassword');
  const tc = useTranslations('common');
  const { error, form, isDirty, resetForm, savePassword, saving, updateField } =
    useChangePassword();

  const passwordFields: Array<{ id: PasswordField; label: string }> = [
    { id: 'oldPassword', label: t('currentPassword') },
    { id: 'newPassword', label: t('newPassword') },
    { id: 'newPasswordConfirmation', label: t('confirmNewPassword') },
  ];
  const [visibleFields, setVisibleFields] = useState<
    Partial<Record<PasswordField, boolean>>
  >({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await savePassword();
  };

  const toggleVisibility = (field: PasswordField): void => {
    setVisibleFields((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  return (
    <section className="min-h-screen bg-[#f7faf5] text-[#2b352f]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:gap-14 lg:px-8 lg:py-14">
        <AccountSidebar activeItem="change-password" />

        <div className="min-w-0 flex-1">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#2b352f] sm:text-5xl">
              {t('title')}
            </h1>
          </header>

          <div className="w-full max-w-2xl rounded-lg bg-[#eff5ef] p-5 shadow-sm sm:p-8">
            <form className="space-y-7" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg border border-[#a83836]/20 bg-white px-4 py-3 text-sm font-semibold text-[#67040d]">
                  {error}
                </div>
              )}

              {passwordFields.map((field) => {
                const isVisible = Boolean(visibleFields[field.id]);

                return (
                  <label key={field.id} className="block space-y-2">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#58615b]">
                      {field.label}
                    </span>
                    <span className="relative block">
                      <input
                        value={form[field.id]}
                        onChange={(event) =>
                          updateField(field.id, event.target.value)
                        }
                        className="[&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden w-full rounded-lg border-0 bg-[#e2eae3] px-4 py-3 pr-12 text-[#2b352f] outline-none transition-shadow placeholder:text-[#58615b]/50 focus:ring-2 focus:ring-[#3f6754]/35"
                        placeholder={t('enterPassword')}
                        type={isVisible ? 'text' : 'password'}
                      />
                      <button
                        type="button"
                        onClick={() => toggleVisibility(field.id)}
                        className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#58615b] transition-colors hover:bg-white/70 hover:text-[#325947]"
                        aria-label={
                          isVisible
                            ? `Hide ${field.label}`
                            : `Show ${field.label}`
                        }
                      >
                        {isVisible ? (
                          <EyeOff size={17} strokeWidth={2.1} />
                        ) : (
                          <Eye size={17} strokeWidth={2.1} />
                        )}
                      </button>
                    </span>
                  </label>
                );
              })}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={!isDirty || saving}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#3f6754] ring-1 ring-[#3f6754]/20 transition-colors hover:bg-[#f7faf5] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RotateCcw size={16} strokeWidth={2.2} />
                  {tc('reset')}
                </button>
                <button
                  type="submit"
                  disabled={!isDirty || saving}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3f6754] px-6 py-3 text-sm font-bold text-[#e6ffef] shadow-sm transition-colors hover:bg-[#335b48] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={16} strokeWidth={2.2} />
                  {saving ? tc('saving') : t('updatePassword')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
