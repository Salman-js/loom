import React, { useState } from 'react';
import { FileUpload } from './file-upload';
import { useAddBook } from '../api/api.books';
import { AnimatePresence, motion } from 'framer-motion';

export function AddBookDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    cover?: string;
    title?: string;
    author?: string;
    description?: string;
  } | null>(null);
  console.log('Open: ', open);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { isPending, mutateAsync, isSuccess } = useAddBook({
    onSuccess: () => {
      setSelectedFile(null);
      setUploadError(null);
      setClearFile(true);
      setOpen(false);
    },
  });

  const handleFileChange = (
    newFile: { file: File; cover?: string | undefined } | null
  ) => {
    if (!newFile) {
      setSelectedFile(null);
      setUploadError(null);
      return;
    }
    if (newFile?.file.type === 'application/epub') {
      setSelectedFile(newFile);
      setUploadError(null);
    } else {
      setSelectedFile(null);
      setUploadError('Please upload a valid EPUB file.');
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('No file selected.');
      return;
    }

    const formData = new FormData();
    const cover = await fetch(selectedFile?.cover as string);
    const coverBlob = await cover.blob();
    formData.append('book', selectedFile.file);
    formData.append('cover', coverBlob);
    formData.append('title', selectedFile.title || '');
    formData.append('author', selectedFile.author || '');
    formData.append('description', selectedFile.description || '');
    console.log('FormData: ', formData.get('title'));
    await mutateAsync(formData);
  };
  const [clearFile, setClearFile] = useState(false);
  return (
    <AnimatePresence mode='wait'>
      <motion.div
        initial={{
          scale: 0,
        }}
        animate={{
          scale: 1,
        }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.3 }}
      >
        {open && (
          <FileUpload
            onChange={(files) => handleFileChange(files)}
            clearFile={clearFile}
            setClearFile={setClearFile}
            onUpload={handleUpload}
            loading={isPending}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
