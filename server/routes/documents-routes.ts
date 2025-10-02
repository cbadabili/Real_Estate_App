
import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// Serve document files
router.get('/documents/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../public/documents', filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  // Set appropriate headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  
  // Stream the file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

// Serve document previews
router.get('/documents/preview/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../public/documents', filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  // Set headers for inline viewing
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  
  // Stream the file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

// Track document downloads
router.post('/documents/:id/download', (req, res) => {
  const documentId = req.params.id;
  
  // TODO: Implement actual download tracking in database
  console.log(`Document ${documentId} downloaded by user`);
  
  // For now, just return success
  res.json({ success: true, message: 'Download tracked' });
});

export default router;
