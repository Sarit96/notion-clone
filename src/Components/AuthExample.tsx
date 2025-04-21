import React, { useState } from 'react';
import { useAuth } from '../hooks/useConvexAuth';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

export default function AuthExample() {
  const { isSignedIn, isAuthenticated, isLoading, user } = useAuth();
  const [message, setMessage] = useState('');
  
  // Example mutation that requires authentication
  const createMessage = useMutation(api.messages.create);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('You must be signed in to create a message');
      return;
    }
    
    try {
      await createMessage({ text: message });
      setMessage('');
      alert('Message created successfully!');
    } catch (error) {
      console.error('Error creating message:', error);
      alert('Failed to create message. Please try again.');
    }
  };
  
  if (isLoading) {
    return <div className="p-4 text-center">Loading authentication status...</div>;
  }
  
  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Authentication Example</h2>
      
      <div className="mb-6">
        <p className="mb-2">
          <span className="font-semibold">Signed in with Clerk:</span>{' '}
          {isSignedIn ? (
            <span className="text-green-500">Yes</span>
          ) : (
            <span className="text-red-500">No</span>
          )}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Authenticated with Convex:</span>{' '}
          {isAuthenticated ? (
            <span className="text-green-500">Yes</span>
          ) : (
            <span className="text-red-500">No</span>
          )}
        </p>
        {isSignedIn && user && (
          <p className="mb-2">
            <span className="font-semibold">User:</span>{' '}
            {user.firstName || user.username}
          </p>
        )}
      </div>
      
      {isAuthenticated ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Create a message (requires authentication)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Type your message here..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
          >
            Submit Message
          </button>
        </form>
      ) : (
        <div className="text-center p-4 bg-muted rounded-md">
          <p className="mb-2">You need to be signed in to create messages.</p>
          <p className="text-sm text-muted-foreground">
            The authentication state is managed by Clerk and automatically synced with Convex.
          </p>
        </div>
      )}
    </div>
  );
} 