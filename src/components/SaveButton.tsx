import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { saveMessage, setSaving } from '../store/messageSlice';
import { Button } from './ui/Button';

interface SaveButtonProps {
  content: string;
  activeMessageId?: string | null;
  onSaveComplete?: (isNewMessage: boolean) => void;
}

const SaveButton = ({ content, activeMessageId, onSaveComplete }: SaveButtonProps) => {
  const dispatch = useAppDispatch();
  const isSaving = useAppSelector((state) => state.message.isSaving);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSave = async () => {
    if (!content || content === '<p></p>' || content.trim() === '') {
      alert('Cannot save an empty message');
      return;
    }

    setIsDisabled(true);
    dispatch(setSaving(true));

    // Mock 3-second delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // If there's an active message ID, update it; otherwise create new
    const isNewMessage = !activeMessageId;
    dispatch(saveMessage({ content, messageId: activeMessageId || undefined }));
    dispatch(setSaving(false));
    setIsDisabled(false);
    onSaveComplete?.(isNewMessage);
  };

  const icon = (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );

  return (
    <Button
      onClick={handleSave}
      isLoading={isSaving || isDisabled}
      leftIcon={icon}
      className="shadow-md hover:shadow-lg"
    >
      {isSaving || isDisabled ? 'Saving...' : activeMessageId ? 'Update Message' : 'Save Message'}
    </Button>
  );
};

export default SaveButton;

