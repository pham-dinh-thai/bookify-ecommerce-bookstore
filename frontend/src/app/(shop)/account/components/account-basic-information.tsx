'use client';
import { RotateCcw, Save } from 'lucide-react';
import Link from 'next/link';
import { FormEvent } from 'react';
import { useMyBasicInfo } from '../hooks/use-my-basic-info';
import { Gender, genderOptions } from '../types';
import AccountSidebar from './account-sidebar';

export default function AccountBasicInformation() {
  const {
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
    retry,
    saveBasicInfo,
    saveEmail,
    saving,
    updateEmailField,
    updateField,
  } = useMyBasicInfo();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await saveBasicInfo();
  };

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await saveEmail();
  };

  return (
    <section className="min-h-screen bg-[#f7faf5] text-[#2b352f]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:gap-14 lg:px-8 lg:py-14">
        <AccountSidebar activeItem="basic-information" />

        <div className="min-w-0 flex-1">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#2b352f] sm:text-5xl">
              Basic Information
            </h1>
          </header>

          {loading ? (
            <div className="w-full max-w-2xl rounded-lg bg-[#eff5ef] p-5 shadow-sm sm:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="h-24 animate-pulse rounded-lg bg-white/70" />
                <div className="h-24 animate-pulse rounded-lg bg-white/70" />
                <div className="h-24 animate-pulse rounded-lg bg-white/70 md:col-span-2" />
              </div>
            </div>
          ) : error && !profile ? (
            <div className="w-full max-w-2xl rounded-lg border border-[#a83836]/20 bg-white p-6">
              <h2 className="text-xl font-bold text-[#2b352f]">
                Account details unavailable
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#58615b]">{error}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={retry}
                  className="rounded-full bg-[#3f6754] px-5 py-2.5 text-sm font-bold text-[#e6ffef] transition-colors hover:bg-[#335b48]"
                >
                  Try again
                </button>
                <Link
                  href="/login"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#3f6754] ring-1 ring-[#3f6754]/20 transition-colors hover:bg-[#f7faf5]"
                >
                  Log in
                </Link>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-2xl rounded-lg bg-[#eff5ef] p-5 shadow-sm sm:p-8">
              <div className="space-y-8">
                <form className="space-y-7" onSubmit={handleSubmit}>
                  {error && (
                    <div className="rounded-lg border border-[#a83836]/20 bg-white px-4 py-3 text-sm font-semibold text-[#67040d]">
                      {error}
                    </div>
                  )}

                  <label className="block space-y-2">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#58615b]">
                      First Name
                    </span>
                    <input
                      value={form.firstName}
                      onChange={(event) =>
                        updateField('firstName', event.target.value)
                      }
                      className="w-full rounded-lg border-0 bg-[#e2eae3] px-4 py-3 text-[#2b352f] outline-none transition-shadow placeholder:text-[#58615b]/50 focus:ring-2 focus:ring-[#3f6754]/35"
                      placeholder="Enter first name"
                      type="text"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#58615b]">
                      Last Name
                    </span>
                    <input
                      value={form.lastName}
                      onChange={(event) =>
                        updateField('lastName', event.target.value)
                      }
                      className="w-full rounded-lg border-0 bg-[#e2eae3] px-4 py-3 text-[#2b352f] outline-none transition-shadow placeholder:text-[#58615b]/50 focus:ring-2 focus:ring-[#3f6754]/35"
                      placeholder="Enter last name"
                      type="text"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#58615b]">
                      Gender
                    </span>
                    <select
                      value={form.gender}
                      onChange={(event) =>
                        updateField('gender', event.target.value as Gender)
                      }
                      className="w-full rounded-lg border-0 bg-[#e2eae3] px-4 py-3 text-[#2b352f] outline-none transition-shadow focus:ring-2 focus:ring-[#3f6754]/35"
                    >
                      {genderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={!isDirty || saving}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#3f6754] ring-1 ring-[#3f6754]/20 transition-colors hover:bg-[#f7faf5] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <RotateCcw size={16} strokeWidth={2.2} />
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={!isDirty || saving}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3f6754] px-6 py-3 text-sm font-bold text-[#e6ffef] shadow-sm transition-colors hover:bg-[#335b48] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Save size={16} strokeWidth={2.2} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>

                <form
                  className="space-y-7 border-t border-[#d7e3d8] pt-8"
                  onSubmit={handleEmailSubmit}
                >
                  {emailError && (
                    <div className="rounded-lg border border-[#a83836]/20 bg-white px-4 py-3 text-sm font-semibold text-[#67040d]">
                      {emailError}
                    </div>
                  )}

                  <label className="block space-y-2">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#58615b]">
                      Email
                    </span>
                    <input
                      value={emailForm.email}
                      onChange={(event) => updateEmailField(event.target.value)}
                      className="w-full rounded-lg border-0 bg-[#e2eae3] px-4 py-3 text-[#2b352f] outline-none transition-shadow placeholder:text-[#58615b]/50 focus:ring-2 focus:ring-[#3f6754]/35"
                      placeholder="email@example.com"
                      type="email"
                    />
                  </label>

                  <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={resetEmailForm}
                      disabled={!isEmailDirty || emailSaving}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#3f6754] ring-1 ring-[#3f6754]/20 transition-colors hover:bg-[#f7faf5] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <RotateCcw size={16} strokeWidth={2.2} />
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={!isEmailDirty || emailSaving}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3f6754] px-6 py-3 text-sm font-bold text-[#e6ffef] shadow-sm transition-colors hover:bg-[#335b48] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Save size={16} strokeWidth={2.2} />
                      {emailSaving ? 'Updating...' : 'Update Email'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
