import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Note interface defines the shape of a note object
export interface Note {
    id: string;
    title: string;
    content: string;
    parentId: number | null;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}

// Context type for notes, including CRUD operations and state
interface NoteContextType {
    notes: Note[];
    addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Note>;
    updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
    getSubnotes: (parentId: string | null) => Note[];
    loading: boolean;
    error: string | null;
}

// Create the NoteContext
const NoteContext = createContext<NoteContextType | undefined>(undefined);

// Provider component to wrap app and provide note state
export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    // Load notes when user changes (login/logout)
    useEffect(() => {
        if (user) {
            loadNotes();
        } else {
            setNotes([]);
        }
    }, [user]);

    // Fetch notes from API
    const loadNotes = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/notes', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to load notes');
            const data = await response.json();
            // Convert date strings to Date objects
            setNotes(data.map((note: any) => ({
                ...note,
                createdAt: new Date(note.createdAt),
                updatedAt: new Date(note.updatedAt)
            })));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load notes');
        } finally {
            setLoading(false);
        }
    };

    // Add a new note via API
    const addNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const endpoint = noteData.parentId ? '/api/notes/subnote' : '/api/notes';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(noteData)
            });

            if (!response.ok) throw new Error('Failed to create note');
            
            const newNote = await response.json();
            const noteWithDates = {
                ...newNote,
                createdAt: new Date(newNote.createdAt),
                updatedAt: new Date(newNote.updatedAt)
            };
            
            setNotes(prev => [...prev, noteWithDates]);
            await loadNotes(); // Reload the notes list
            return noteWithDates;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create note');
            throw err;
        }
    };

    // Update an existing note via API
    const updateNote = async (id: string, updates: Partial<Note>) => {
        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) throw new Error('Failed to update note');

            const updatedNote = await response.json();
            setNotes(prev => prev.map(note => 
                note.id === id ? {
                    ...note,
                    ...updatedNote,
                    createdAt: new Date(updatedNote.createdAt),
                    updatedAt: new Date(updatedNote.updatedAt)
                } : note
            ));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update note');
        }
    };

    // Delete a note via API
    const deleteNote = async (id: string) => {
        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete note');

            setNotes(prev => prev.filter(note => note.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete note');
        }
    };

    // Get subnotes for a given parentId
    const getSubnotes = (parentId: string | null) => {
        return notes.filter(note => note.parentId === parentId);
    };

    // Provide context to children
    return (
        <NoteContext.Provider value={{
            notes,
            addNote,
            updateNote,
            deleteNote,
            getSubnotes,
            loading,
            error
        }}>
            {children}
        </NoteContext.Provider>
    );
};

// Custom hook to use notes context
export const useNotes = () => {
    const context = useContext(NoteContext);
    if (context === undefined) {
        throw new Error('useNotes must be used within a NoteProvider');
    }
    return context;
}; 