import { cn, getCover } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: 20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: { file: File; cover?: string | undefined } | null) => void;
}) => {
  const [file, setFile] = useState<{
    file: File;
    cover?: string | undefined;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (newFile: File | null) => {
    console.log('New File: ', newFile);
    if (newFile) {
      const bookUrl: string | ArrayBuffer = await newFile.arrayBuffer();
      const cover = (await getCover(bookUrl)) || undefined;
      const newFiles = { file: newFile, cover };
      setFile({
        file: newFile,
        cover,
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

  const { getRootProps, isDragActive, acceptedFiles } = useDropzone({
    multiple: false,
    noClick: true,
    onDropRejected: (error) => {
      console.log(error);
    },
  });
  useEffect(() => {
    handleFileChange(acceptedFiles[0] || null);
  }, [acceptedFiles]);
  return (
    <div className='w-full' {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover='animate'
        className='p-4 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden'
      >
        <input
          ref={fileInputRef}
          id='file-upload-handle'
          type='file'
          multiple={false}
          accept='.epub'
          onChange={(e) => {
            console.log(e.target.files);
            handleFileChange(e.target.files?.[0] || null);
          }}
          className='hidden'
        />
        <div className='absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]'>
          <GridPattern />
        </div>
        <div className='flex flex-col items-center justify-center'>
          <div className='relative w-full mt-10 max-w-xl mx-auto'>
            {file && (
              <motion.div
                layoutId='file-upload'
                className={cn(
                  'relative z-40 bg-white dark:bg-neutral-900 flex flex-row items-start justify-between p-4 mt-4 w-full mx-auto rounded-md',
                  'shadow-sm'
                )}
              >
                <div className='flex flex-col justify-start w-full items-start gap-4'>
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    src={file?.cover}
                  />
                </div>
                <div className='flex lg:w-1/2 flex-col justify-between h-full w-full items-end gap-4'>
                  <div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className='text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs'
                    >
                      {file?.file.name}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className='rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input'
                    >
                      {(file.file?.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>
                  <div className='absolute bottom-2 right-2'>
                    <Button
                      size='icon'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileChange(null);
                        setFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      variant='outline'
                    >
                      <X />{' '}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
            {!file && (
              <motion.div
                layoutId='file-upload'
                variants={mainVariant}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  'relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md',
                  'shadow-[0px_10px_50px_rgba(0,0,0,0.1)]'
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='text-neutral-600 flex flex-col items-center'
                  >
                    Drop it
                    <Upload className='h-4 w-4 text-neutral-600 dark:text-neutral-400' />
                  </motion.p>
                ) : (
                  <Upload className='h-4 w-4 text-neutral-600 dark:text-neutral-300' />
                )}
              </motion.div>
            )}
            {!file && (
              <motion.div
                variants={secondaryVariant}
                className='absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md'
              ></motion.div>
            )}
          </div>
        </div>
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
