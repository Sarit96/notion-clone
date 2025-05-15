import { Request, Response } from 'express';
import { models } from '../models';

const { Note, User } = models;

// Custom interface for Request with user property
interface CustomRequest extends Request {
    user?: {
        userId: number;
        email: string;
    };
}

/**
 * Get all subnotes for a parent note
 */
export const getSubnotes = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const parentId = parseInt(req.params.parentId);

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const subnotes = await Note.findAll({
            where: {
                userId,
                parentId
            },
            order: [['createdAt', 'ASC']]
        });

        res.json(subnotes);
    } catch (error) {
        console.error('Error in getSubnotes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Create a new subnote
 */
export const createSubnote = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const parentId = parseInt(req.params.parentId);
        const { title, content, icon, cover_url } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Verify parent note exists and belongs to user
        const parentNote = await Note.findOne({
            where: { id: parentId, userId }
        });

        if (!parentNote) {
            return res.status(404).json({ error: 'Parent note not found' });
        }

        const subnote = await Note.create({
            userId,
            parentId,
            title: title || 'Untitled',
            content: content || '',
            icon: icon || null,
            cover_url: cover_url || null
        });

        res.status(201).json(subnote);
    } catch (error) {
        console.error('Error in createSubnote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Update a subnote
 */
export const updateSubnote = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const subnoteId = parseInt(req.params.subnoteId);
        const { title, content, icon, cover_url } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const subnote = await Note.findOne({
            where: { id: subnoteId, userId }
        });

        if (!subnote) {
            return res.status(404).json({ error: 'Subnote not found' });
        }

        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (icon !== undefined) updateData.icon = icon;
        if (cover_url !== undefined) updateData.cover_url = cover_url;

        await subnote.update(updateData);

        const updatedSubnote = await Note.findOne({
            where: { id: subnoteId }
        });

        res.json(updatedSubnote);
    } catch (error) {
        console.error('Error in updateSubnote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Delete a subnote
 */
export const deleteSubnote = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const subnoteId = parseInt(req.params.subnoteId);

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const subnote = await Note.findOne({
            where: { id: subnoteId, userId }
        });

        if (!subnote) {
            return res.status(404).json({ error: 'Subnote not found' });
        }

        await subnote.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error in deleteSubnote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 