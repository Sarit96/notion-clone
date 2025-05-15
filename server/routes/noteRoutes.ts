/**
 * Note Routes
 * Defines API endpoints for note operations
 */

import express from 'express';
import { getOrCreateNote, updateNote, shareNote, getNotePdf } from '../controllers/noteController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all note routes
router.use(authenticateToken);

// Get or create a note for current user
router.get('/', getOrCreateNote);

// Update note content and metadata
router.put('/', updateNote);

// Share a note (generate publicId and return public link)
router.post('/:id/share', shareNote);

// Generate and stream a PDF of a note
router.get('/:id/pdf', getNotePdf);

export default router; 