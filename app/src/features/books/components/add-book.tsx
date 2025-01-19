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
import { FileUpload } from './file-upload';

export function AddBookDialog() {
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    cover?: string | undefined;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Handle file input change
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

  // Handle file upload submission
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('No file selected.');
      return;
    }

    const formData = new FormData();
    // formData.append('files', selectedFiles);

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
      <DialogContent className='w-4/5 lg:w-1/2' title='Add book'>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Import or drag and drop your{' '}
            <code className='bg-muted rounded-md px-1'>.epub</code> files. Click
            save when you're done.
          </DialogDescription>
        </DialogHeader>
        <FileUpload onChange={(files) => handleFileChange(files)} />
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
