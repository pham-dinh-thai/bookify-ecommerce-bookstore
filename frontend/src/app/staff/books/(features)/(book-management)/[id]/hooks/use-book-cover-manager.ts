import { useState } from 'react';
import { useToast } from '@/shared/common/toast/toast';
import {
  createBookCoverService,
  deleteBookCoverService,
  uploadBookCoverFileService,
} from '../../services/book-cover.service';

interface UseBookCoverManagerProps {
  bookId: string;
  refetch: () => Promise<void>;
}

export default function useBookCoverManager({
  bookId,
  refetch,
}: UseBookCoverManagerProps) {
  const { addToast } = useToast();
  const [uploadingCover, setUploadingCover] = useState(false);
  const [deletingCoverId, setDeletingCoverId] = useState<string | null>(null);

  const handleAddCover = async (file: File, nextDisplayOrder: number) => {
    if (uploadingCover) return;

    try {
      setUploadingCover(true);
      const url = await uploadBookCoverFileService(file);

      await createBookCoverService(bookId, {
        url,
        isPrimary: false,
        displayOrder: nextDisplayOrder,
      });
      await refetch();
      addToast('Cover added successfully.', 'success');
    } catch (error) {
      addToast(
        error instanceof Error
          ? error.message
          : 'Failed to add cover. Please try again.',
        'error',
      );
    } finally {
      setUploadingCover(false);
    }
  };

  const handleDeleteCover = async (coverId: string) => {
    if (deletingCoverId) return;

    try {
      setDeletingCoverId(coverId);
      await deleteBookCoverService(bookId, coverId);
      await refetch();
      addToast('Cover deleted successfully.', 'success');
    } catch (error) {
      addToast(
        error instanceof Error
          ? error.message
          : 'Failed to delete cover. Please try again.',
        'error',
      );
    } finally {
      setDeletingCoverId(null);
    }
  };

  return {
    uploadingCover,
    deletingCoverId,
    handleAddCover,
    handleDeleteCover,
  };
}
