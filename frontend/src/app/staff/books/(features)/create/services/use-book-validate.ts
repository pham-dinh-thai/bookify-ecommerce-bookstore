import type { CreateBookForm, CreateBookFormErrors } from '../../../types';

export const validateBookForm = (
  formData: CreateBookForm,
): CreateBookFormErrors => {
  const newErrors: CreateBookFormErrors = {};

  if (!formData.isbn.trim()) {
    newErrors.isbn = 'ISBN is required';
  }

  if (!formData.title.trim()) {
    newErrors.title = 'Title is required';
  }

  if (!formData.description.trim()) {
    newErrors.description = 'Description is required';
  }

  if (formData.originalPrice <= 0) {
    newErrors.originalPrice = 'Original price must be greater than 0';
  }

  if (formData.quantity < 0) {
    newErrors.quantity = 'Quantity cannot be negative';
  }

  if (formData.pageCount <= 0) {
    newErrors.pageCount = 'Page count must be greater than 0';
  }

  if (!formData.publisherId) {
    newErrors.publisherId = 'Publisher is required';
  }

  if (!formData.languageId) {
    newErrors.languageId = 'Language is required';
  }

  if (!formData.coverUrl.trim()) {
    newErrors.coverUrl = 'Cover URL is required';
  }

  if (formData.authorIds.length === 0) {
    newErrors.authorIds = 'At least one author is required';
  }

  if (formData.genreIds.length === 0) {
    newErrors.genreIds = 'At least one genre is required';
  }

  return newErrors;
};
