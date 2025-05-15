/**
 * Note Controller
 * Handles note-related operations: getting/creating and updating notes
 */

import { Request, Response } from 'express';
import { models } from '../models';
import { randomBytes } from 'crypto';
import PDFDocument from 'pdfkit';

const { Note, User } = models;

// Custom interface for Request with user property
interface CustomRequest extends Request {
    user?: {
        userId: number;
        email: string;
    };
}

/**
 * Get or create a note for authenticated user
 * Returns existing note or creates new one if none exists
 */
export const getOrCreateNote = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Verify user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if user has a note
        let note = await Note.findOne({
            where: { userId }
        });

        if (!note) {
            // Create a new note if none exists
            note = await Note.create({
                userId,
                title: 'Untitled',
                content: '',  // Initialize with empty content
                icon: null,
                cover_url: null
            });
        }

        res.json(note);
    } catch (error) {
        console.error('Error in getOrCreateNote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Update note content and metadata
 * Updates title, content, icon, and cover URL
 */
export const updateNote = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { title, content, icon, cover_url } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Find the note first
        const note = await Note.findOne({ where: { userId } });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Update only the fields that are provided in the request
        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (icon !== undefined) updateData.icon = icon;
        if (cover_url !== undefined) updateData.cover_url = cover_url;

        // Update the note with only the changed fields
        await note.update(updateData);

        // Fetch the updated note
        const updatedNote = await Note.findOne({ where: { userId } });
        res.json(updatedNote);
    } catch (error) {
        console.error('Error in updateNote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Generate a publicId for a note and return the public link
 */
export const shareNote = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const noteId = req.params.id;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Find the note by id and userId
        const note = await Note.findOne({ where: { id: noteId, userId } });
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // If already has a publicId, reuse it
        if (!note.publicId) {
            // Generate a random 32-character string
            const publicId = randomBytes(16).toString('hex');
            note.publicId = publicId;
            await note.save();
        }

        // Return the public link (frontend should know the base URL)
        res.json({ publicLink: `/public/note/${note.publicId}` });
    } catch (error) {
        console.error('Error in shareNote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Generate and stream a PDF of a note
 */
export const getNotePdf = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const noteId = req.params.id;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Find the note by id and userId
        const note = await Note.findOne({ where: { id: noteId, userId } });
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Create a PDF document
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=note-${note.id}.pdf`);
        doc.pipe(res);

        doc.fontSize(20).text(note.title, { underline: true });
        doc.moveDown();
        doc.fontSize(12).text(note.content || '', { align: 'left' });

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 