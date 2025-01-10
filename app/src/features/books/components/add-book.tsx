import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Album, Plus } from 'lucide-react';
import { SidebarMenuButton } from '@/components/ui/sidebar';

export function AddBookDialog() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/epub') {
      setSelectedFile(file);
    } else {
      setUploadError('Please upload a valid EPUB file.');
    }
  };

  // Handle file upload submission
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file-upload', selectedFile);

    try {
      setUploading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.fileUrl) {
        setUploadError(null);
        alert(`File uploaded successfully! URL: ${result.fileUrl}`);
      } else {
        setUploadError('Upload failed. Please try again.');
      }
    } catch (error) {
      console.log('Error: ', error);
      setUploadError('Error during file upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
          tooltip='Shelves'
        >
          <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent'>
            <Plus />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>Add book</span>
          </div>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]' title='Add book'>
        <DialogHeader>
          <DialogTitle>Add book</DialogTitle>
          <DialogDescription>
            Import <code className='bg-muted rounded-md px-1'>.epub</code>{' '}
            files. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='col-span-full'>
            <div className='mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10'>
              <div className='text-center'>
                <Album
                  aria-hidden='true'
                  className='mx-auto size-12 text-gray-300'
                />
                <div className='mt-4 flex text-sm/6 text-gray-600'>
                  <label
                    htmlFor='file-upload'
                    className='relative cursor-pointer rounded-md bg-background font-semibold text-indigo-600 focus-within:outline-none hover:text-indigo-500'
                  >
                    <span>Upload a file</span>
                    <input
                      id='file-upload'
                      name='file-upload'
                      type='file'
                      className='sr-only'
                      accept='.epub'
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className='pl-1'>or drag and drop files</p>
                </div>
                <p className='text-xs/5 text-gray-600'>up to 10MB</p>
              </div>
            </div>
          </div>
        </div>
        {uploadError && <p className='text-red-500 text-sm'>{uploadError}</p>}
        <DialogFooter>
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
