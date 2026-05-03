'use client';

import { useState } from 'react';
import { Eye, EyeOff, ChevronDown, X } from 'lucide-react';
import CreateUserAction from './create-user-action';
import { createUserService } from '../services/create-user-service';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/admin/components/toast/toast';
import { formStyles } from '@/shared/common/form/form-styles';
import { validateUserForm } from '../services/use-user-validate';

export default function CreateUserForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateUserForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: 'other',
    roleId: 'staff',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const { addToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CreateUserForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const { fieldStyle, inputClass, selectClass, labelClass, labelStyle } =
    formStyles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateUserForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      setIsLoading(true);

      await createUserService(formData);
      addToast('User created successfully', 'success');
      router.push('/admin/users');
    } catch (err: unknown) {
      let message = 'Something went wrong';

      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        message = String((err as any).message);
      }

      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8"
    >
      <div className="space-y-3">
        <label className={labelClass} style={labelStyle}>
          First Name
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="e.g. Julian"
          className={inputClass}
          style={fieldStyle}
        />
        {errors.firstName && (
          <p className="text-sm text-red-500 ml-1">{errors.firstName}</p>
        )}
      </div>

      <div className="space-y-3">
        <label className={labelClass} style={labelStyle}>
          Last Name
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="e.g. Barnes"
          className={inputClass}
          style={fieldStyle}
        />
        {errors.lastName && (
          <p className="text-sm text-red-500 ml-1">{errors.lastName}</p>
        )}
      </div>

      <div className="space-y-3">
        <label className={labelClass} style={labelStyle}>
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="julian@bookify.dev"
          className={inputClass}
          style={fieldStyle}
        />
        {errors.email && (
          <p className="text-sm text-red-500 ml-1">{errors.email}</p>
        )}
      </div>

      <div className="space-y-3">
        <label className={labelClass} style={labelStyle}>
          Gender
        </label>
        <div className="relative">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={selectClass}
            style={fieldStyle}
          >
            <option value="other">Other</option>{' '}
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <ChevronDown
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5"
            style={{ color: '#58615b' }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className={labelClass} style={labelStyle}>
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••••••"
            className={inputClass}
            style={fieldStyle}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            style={{ color: '#58615b' }}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500 ml-1">{errors.password}</p>
        )}
      </div>

      <div className="space-y-3">
        <label className={labelClass} style={labelStyle}>
          Role
        </label>
        <div className="relative">
          <select
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            className={selectClass}
            style={fieldStyle}
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
          <ChevronDown
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5"
            style={{ color: '#58615b' }}
          />
        </div>
      </div>

      <CreateUserAction
        setErrors={setErrors}
        setFormData={setFormData}
        isLoading={isLoading}
      />
    </form>
  );
}
