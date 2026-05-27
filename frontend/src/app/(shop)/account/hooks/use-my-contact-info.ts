'use client';

import { refreshAccessToken } from '@/shared/auth/lib/refresh';
import { getAccessToken } from '@/shared/auth/lib/token-storage';
import { useToast } from '@/shared/common/toast/toast';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getProvinces,
  getWardsByProvince,
} from '../services/address-location.service';
import {
  addMyAddressService,
  findMyContactInfoService,
  removeMyAddressService,
  setDefaultMyAddressService,
  updateMyPhoneNumberService,
} from '../services/contact-info.service';
import {
  AddressForm,
  MyContactInfo,
  PhoneNumberForm,
  Province,
  Ward,
} from '../types';

const phoneNumberRegex = /^(\+84|0)[3-9]\d{8}$/;

const emptyPhoneForm: PhoneNumberForm = {
  phoneNumber: '',
};

const emptyAddressForm: AddressForm = {
  street: '',
  provinceCode: '',
  provinceName: '',
  wardCode: '',
  wardName: '',
};

function sortDefaultAddressFirst(contact: MyContactInfo): MyContactInfo {
  return {
    ...contact,
    addresses: [...contact.addresses].sort(
      (first, second) => Number(second.isDefault) - Number(first.isDefault),
    ),
  };
}

async function ensureAccessToken(): Promise<boolean> {
  if (getAccessToken()) return true;

  const token = await refreshAccessToken();
  return Boolean(token);
}

export function useMyContactInfo() {
  const toast = useToast();
  const [contact, setContact] = useState<MyContactInfo | null>(null);
  const [phoneForm, setPhoneForm] =
    useState<PhoneNumberForm>(emptyPhoneForm);
  const [addressForm, setAddressForm] =
    useState<AddressForm>(emptyAddressForm);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingWards, setLoadingWards] = useState(false);
  const [savingPhone, setSavingPhone] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null,
  );
  const [settingDefaultAddressId, setSettingDefaultAddressId] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const isPhoneDirty = useMemo(() => {
    if (!contact) return false;

    return phoneForm.phoneNumber !== (contact.phoneNumber ?? '');
  }, [contact, phoneForm.phoneNumber]);

  const loadContactInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPhoneError(null);
    setAddressError(null);

    try {
      const hasToken = await ensureAccessToken();
      if (!hasToken) {
        setError('Please log in to manage your contact information.');
        return;
      }

      const data = sortDefaultAddressFirst(await findMyContactInfoService());
      setContact(data);
      setPhoneForm({ phoneNumber: data.phoneNumber ?? '' });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to load contact information.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadContactInfo();

      getProvinces()
        .then((data) => {
          setProvinces(data);
          setLocationError(null);
        })
        .catch((err) => {
          const message =
            err instanceof Error ? err.message : 'Unable to load provinces.';
          setLocationError(message);
        });
    });
  }, [loadContactInfo]);

  useEffect(() => {
    queueMicrotask(() => {
      if (!addressForm.provinceCode) {
        setWards([]);
        return;
      }

      setLoadingWards(true);
      getWardsByProvince(addressForm.provinceCode)
        .then((data) => {
          setWards(data);
          setLocationError(null);
        })
        .catch((err) => {
          const message =
            err instanceof Error ? err.message : 'Unable to load wards.';
          setWards([]);
          setLocationError(message);
        })
        .finally(() => setLoadingWards(false));
    });
  }, [addressForm.provinceCode]);

  const updatePhoneField = (value: string): void => {
    setPhoneForm({ phoneNumber: value });
  };

  const resetPhoneForm = (): void => {
    if (!contact) return;

    setPhoneForm({ phoneNumber: contact.phoneNumber ?? '' });
  };

  const updateAddressField = <K extends keyof AddressForm>(
    field: K,
    value: AddressForm[K],
  ): void => {
    setAddressForm((current) => {
      if (field === 'provinceCode') {
        const selectedProvince = provinces.find(
          (province) => String(province.code) === value,
        );

        return {
          ...current,
          provinceCode: value,
          provinceName: selectedProvince?.name ?? '',
          wardCode: '',
          wardName: '',
        };
      }

      if (field === 'wardCode') {
        const selectedWard = wards.find((ward) => String(ward.code) === value);

        return {
          ...current,
          wardCode: value,
          wardName: selectedWard?.name ?? '',
        };
      }

      return { ...current, [field]: value };
    });
  };

  const resetAddressForm = (): void => {
    setAddressForm(emptyAddressForm);
    setWards([]);
  };

  const savePhoneNumber = async (): Promise<void> => {
    const payload = {
      phoneNumber: phoneForm.phoneNumber.trim(),
    };

    if (!payload.phoneNumber) {
      setPhoneError('Phone number is required.');
      return;
    }

    if (!phoneNumberRegex.test(payload.phoneNumber)) {
      setPhoneError('Phone number must be a valid Vietnamese mobile number.');
      return;
    }

    setSavingPhone(true);
    setPhoneError(null);

    try {
      const hasToken = await ensureAccessToken();
      if (!hasToken) {
        setPhoneError('Please log in to manage your contact information.');
        return;
      }

      await updateMyPhoneNumberService(payload);
      setContact((current) =>
        current
          ? { ...current, phoneNumber: payload.phoneNumber }
          : { phoneNumber: payload.phoneNumber, addresses: [] },
      );
      setPhoneForm(payload);
      toast?.addToast('Phone number updated', 'success');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to update phone number.';
      setPhoneError(message);
      toast?.addToast(message, 'error');
    } finally {
      setSavingPhone(false);
    }
  };

  const addAddress = async (): Promise<void> => {
    const payload = {
      ...addressForm,
      street: addressForm.street.trim(),
    };

    if (!payload.street) {
      setAddressError('Street is required.');
      return;
    }

    if (
      !payload.provinceCode ||
      !payload.provinceName ||
      !payload.wardCode ||
      !payload.wardName
    ) {
      setAddressError('Province and ward are required.');
      return;
    }

    setAddingAddress(true);
    setAddressError(null);

    try {
      const hasToken = await ensureAccessToken();
      if (!hasToken) {
        setAddressError('Please log in to manage your contact information.');
        return;
      }

      await addMyAddressService(payload);
      await loadContactInfo();
      resetAddressForm();
      toast?.addToast('Address added', 'success');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to add address.';
      setAddressError(message);
      toast?.addToast(message, 'error');
    } finally {
      setAddingAddress(false);
    }
  };

  const removeAddress = async (id: string): Promise<void> => {
    setDeletingAddressId(id);
    setAddressError(null);

    try {
      const hasToken = await ensureAccessToken();
      if (!hasToken) {
        setAddressError('Please log in to manage your contact information.');
        return;
      }

      await removeMyAddressService(id);
      setContact((current) =>
        current
          ? {
              ...current,
              addresses: current.addresses.filter(
                (address) => address.id !== id,
              ),
            }
          : current,
      );
      toast?.addToast('Address removed', 'success');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to remove address.';
      setAddressError(message);
      toast?.addToast(message, 'error');
    } finally {
      setDeletingAddressId(null);
    }
  };

  const setDefaultAddress = async (id: string): Promise<void> => {
    setSettingDefaultAddressId(id);
    setAddressError(null);

    try {
      const hasToken = await ensureAccessToken();
      if (!hasToken) {
        setAddressError('Please log in to manage your contact information.');
        return;
      }

      await setDefaultMyAddressService(id);
      setContact((current) =>
        current
          ? sortDefaultAddressFirst({
              ...current,
              addresses: current.addresses.map((address) => ({
                ...address,
                isDefault: address.id === id,
              })),
            })
          : current,
      );
      toast?.addToast('Default address updated', 'success');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to update address.';
      setAddressError(message);
      toast?.addToast(message, 'error');
    } finally {
      setSettingDefaultAddressId(null);
    }
  };

  return {
    addAddress,
    addingAddress,
    addressError,
    addressForm,
    contact,
    deletingAddressId,
    error,
    isPhoneDirty,
    loading,
    loadingWards,
    locationError,
    phoneError,
    phoneForm,
    provinces,
    removeAddress,
    resetAddressForm,
    resetPhoneForm,
    retry: loadContactInfo,
    savePhoneNumber,
    savingPhone,
    setDefaultAddress,
    settingDefaultAddressId,
    updateAddressField,
    updatePhoneField,
    wards,
  };
}
