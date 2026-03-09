import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

const NOTE_TYPES = [
  { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
  { value: 'interview', label: 'Interview', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { value: 'followup', label: 'Follow-up', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { value: 'offer', label: 'Offer', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { value: 'rejection', label: 'Rejection', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
];

export default function NotesTimeline({ applicationId, notes = [] }) {
  const [newNote, setNewNote] = useState({ content: '', note_type: 'general' });
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: async (noteData) => {
      const response = await apiClient.post(
        `/applications/${applicationId}/notes`,
        noteData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['application', applicationId]);
      setNewNote({ content: '', note_type: 'general' });
      setIsAdding(false);
    }
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId) => {
      await apiClient.delete(`/applications/${applicationId}/notes/${noteId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['application', applicationId]);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newNote.content.trim()) return;
    
    createNoteMutation.mutate({
      application_id: applicationId,
      content: newNote.content.trim(),
      note_type: newNote.note_type
    });
  };

  const getNoteTypeStyle = (type) => {
    return NOTE_TYPES.find(t => t.value === type)?.color || NOTE_TYPES[0].color;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Notes Timeline
        </h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            + Add Note
          </button>
        )}
      </div>

      {/* Add Note Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Note Type
              </label>
              <select
                value={newNote.note_type}
                onChange={(e) => setNewNote({ ...newNote, note_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {NOTE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows={3}
                placeholder="Add your note here..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createNoteMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {createNoteMutation.isPending ? 'Saving...' : 'Save Note'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewNote({ content: '', note_type: 'general' });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Notes Timeline */}
      <div className="relative">
        {notes.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
            No notes yet. Add your first note to track updates!
          </p>
        ) : (
          <div className="space-y-4">
            {/* Vertical Timeline Line */}
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700" />
            
            {notes.map((note, index) => (
              <div key={note.id} className="relative pl-12 group">
                {/* Timeline Dot */}
                <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500 border-2 border-white dark:border-gray-900" />
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNoteTypeStyle(note.note_type)}`}>
                      {NOTE_TYPES.find(t => t.value === note.note_type)?.label || note.note_type}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(note.created_at)}
                      </span>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this note?')) {
                            deleteNoteMutation.mutate(note.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-opacity"
                        title="Delete note"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
