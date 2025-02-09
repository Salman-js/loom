import { cn, getMetaData } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Download, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

export const FileUpload = ({
  onChange,
  clearFile,
  setClearFile,
  onUpload,
  loading = false,
  onCancel,
}: {
  onChange?: (files: { file: File; cover?: string | undefined } | null) => void;
  clearFile?: boolean;
  setClearFile?: React.Dispatch<React.SetStateAction<boolean>>;
  onUpload: () => void;
  loading?: boolean;
  onCancel: () => void;
}) => {
  const [file, setFile] = useState<{
    file: File;
    cover?: string;
    title?: string;
    author?: string;
    publishDate?: string;
    publisher?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (newFile: File | null) => {
    if (newFile) {
      const bookUrl: string | ArrayBuffer = await newFile.arrayBuffer();
      const metaData = (await getMetaData(bookUrl)) || undefined;
      const newFiles = { file: newFile, ...metaData };
      setFile({
        file: newFile,
        ...metaData,
      });
      if (onChange) onChange(newFiles);
    } else {
      setFile(null);
      if (onChange) onChange(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive, inputRef, acceptedFiles } = useDropzone({
    multiple: false,
    noClick: true,

    onDropRejected: (error) => {},
  });
  useEffect(() => {
    handleFileChange(acceptedFiles[0] || null);
  }, [acceptedFiles]);
  useEffect(() => {
    if (clearFile) {
      handleFileChange(null);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setClearFile?.(false);
    }
  }, [clearFile]);
  const { state } = useSidebar();
  return (
    <div className='w-full' {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover='animate'
        className='group/file block rounded-lg cursor-pointer w-full relative overflow-hidden'
      >
        <input
          ref={fileInputRef}
          id='file-upload-handle'
          type='file'
          multiple={false}
          accept='.epub'
          onChange={(e) => {
            handleFileChange(e.target.files?.[0] || null);
          }}
          className='hidden'
        />
        {file && (
          <div
            className='book-card group'
            style={{
              height: state === 'expanded' ? '33em' : '30em',
            }}
          >
            <img src={file.cover} className='h-full w-full absolute' />
            <div className='add-book-card-container'>
              <div className='add-book-card-detail-container h-auto'>
                <div></div>
                <div className='flex flex-col space-y-3'>
                  <div className='flex flex-row justify-center space-x-3'>
                    <div
                      className='p-8 rounded-full bg-background'
                      onClick={(e) => {
                        e.stopPropagation();
                        if (loading) {
                          return;
                        }
                        handleFileChange(null);
                        setFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                    >
                      <X
                        className={`h-10 w-10 ${
                          loading ? 'text-neutral-300' : 'text-neutral-600'
                        } ${
                          loading
                            ? 'dark:text-neutral-600'
                            : 'dark:text-neutral-300'
                        }`}
                      />
                    </div>
                    <div
                      className='p-8 rounded-full bg-background'
                      onClick={(e) => {
                        e.stopPropagation();
                        if (loading) {
                          return;
                        }
                        onUpload();
                      }}
                    >
                      {loading ? (
                        <Loader2 className='h-10 w-10 text-neutral-600 dark:text-neutral-300 animate-spin' />
                      ) : (
                        <Upload className='h-10 w-10 text-neutral-600 dark:text-neutral-300' />
                      )}
                    </div>
                  </div>
                  <div className='text-container'>
                    <p className='font-semibold text-gray-100 text-3xl'>
                      {file.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {!file && (
          <div
            className='book-card group flex flex-col justify-center items-center bg-secondary space-y-4'
            style={{
              height: state === 'expanded' ? '33em' : '30em',
            }}
          >
            <motion.div
              layoutId='file-upload'
              initial={{
                className: 'shadow-[0px_0px_0px_rgba(0,0,0,0.1)]',
              }}
              animate={{
                className: 'shadow-[0px_10px_50px_rgba(0,0,0,0.1)]',
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                duration: 0.5,
              }}
              className={cn(
                'relative group-hover/file:shadow-2xl z-40 p-8 rounded-full bg-background dark:bg-neutral-900 flex items-center justify-center'
              )}
            >
              {isDragActive ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='text-neutral-600 flex flex-col items-center'
                >
                  Drop it
                  <Upload className='h-10 w-10 text-neutral-600 dark:text-neutral-400' />
                </motion.p>
              ) : (
                <Download className='h-10 w-10 text-neutral-600 dark:text-neutral-300' />
              )}
            </motion.div>

            <div
              className='p-8 rounded-full bg-background'
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
            >
              <X
                className={`h-10 w-10 ${
                  loading ? 'text-neutral-300' : 'text-neutral-600'
                } ${
                  loading ? 'dark:text-neutral-600' : 'dark:text-neutral-300'
                }`}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className='flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105'>
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? 'bg-gray-50 dark:bg-neutral-950'
                  : 'bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]'
              }`}
            />
          );
        })
      )}
    </div>
  );
}
