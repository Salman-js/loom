// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle FormData
  },
};

const uploadDir = path.join(process.cwd(), 'src/api/uploads'); // Temporary folder for uploads

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'File upload failed.' });
    }
    const uploadedFile =
      files && files['file-upload'] ? files['file-upload'][0] : null;
    if (!uploadedFile) {
      return;
    }
    const filePath = path.join(uploadDir, uploadedFile?.newFilename);

    // If you want to move the file to 'public' folder
    fs.rename(uploadedFile.filepath, filePath, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error moving file.' });
      }
      return res.status(200).json({
        message: 'File uploaded successfully.',
        fileUrl: `/uploads/${uploadedFile.newFilename}`,
      });
    });
  });
};

export default handler;
