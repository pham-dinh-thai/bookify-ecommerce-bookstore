'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useToast } from '@/app/admin/components/toast/toast';
import { formStyles } from '@/shared/common/form/form-styles';
import useEditUser from '@/app/admin/users/(features)/[id]/hooks/use-edit-user';
import { validateUserForm } from '@/app/admin/users/(features)/[id]/services/update-user-validate';
import { updateUserService } from '@/app/admin/users/(features)/[id]/services/update-user.service';
import EditCustomerAction from './edit-customer-action';

export default function EditCustomerForm({ userId }: { userId: string }) {
  const [formData, setFormData] = useState<EditCustomerForm>({
    firstName: '',
    lastName: '',
    email: '',
    gender: 'other',
    roleId: 'user',
  });

  const { user, loading } = useEditUser(userId);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.email ?? '',
        gender: user.gender ?? 'other',
        roleId: user.roleId ?? 'user',
      });
    }
  }, [user]);

  const [errors, setErrors] = useState<EditFormErrors>({});

  const { addToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof EditUserForm]) {
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

      await updateUserService(userId, formData);
      addToast('Customer updated successfully', 'success');
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
      onSubmit={(e) => {
        console.log('form submitted');
        handleSubmit(e);
      }}
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

      <div className="space-y-3 md:col-span-2">
        <label className={labelClass} style={labelStyle}>
          Email Address
        </label>
        <input
          type="text"
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
          Role
        </label>
        <div className="relative">
          <select
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            disabled
            className={selectClass}
            style={{ ...fieldStyle, opacity: 0.6, cursor: 'not-allowed' }}
          >
            <option value="user">User</option>
          </select>
          <ChevronDown
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5"
            style={{ color: '#58615b' }}
          />
        </div>
      </div>

      <EditCustomerAction
        setErrors={setErrors}
        setFormData={setFormData}
        isLoading={isLoading}
        user={user}
      />
    </form>
  );
}
