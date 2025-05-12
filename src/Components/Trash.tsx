import React from 'react';

interface TrashProps {
  trashedPages: { title: string; id: number }[];
  onRestore: (page: { title: string; id: number }) => void;
  onDelete: (page: { title: string; id: number }) => void;
}

const Trash: React.FC<TrashProps> = ({ trashedPages, onRestore, onDelete }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Trash</h2>
      {trashedPages.length === 0 ? (
        <p>No items in trash.</p>
      ) : (
        <ul>
          {trashedPages.map((page) => (
            <li key={page.id} className="mb-2 p-2 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-between">
              <span>{page.title}</span>
              <div className="flex gap-2">
                <button
                  className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition"
                  onClick={() => onRestore(page)}
                >
                  Restore
                </button>
                <button
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                  onClick={() => onDelete(page)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Trash; 