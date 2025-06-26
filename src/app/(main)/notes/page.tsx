"use client";

import { useEffect, useRef, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import ClickOutside from "@/components/ClickOutside";

type Note = {
  id: number;
  content: string;
  createdAt: Date;
  isEdited: boolean;
};

export default function Notes() {
  const count = useRef(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState<string>("");
  const [editId, setEditId] = useState<number | undefined>();
  const [editNote, setEditNote] = useState<string>("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch('/api/notes');
        const data = await res.json();
        setNotes(data);
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);


  const handleClick = () => {
    if (note.trim() === "") return;
    const newNote: Note = {
      id: count.current++,
      content: note.trim(),
      createdAt: new Date(),
      isEdited: false,
    };
    setNotes([...notes, newNote]);
    setNote("");
  };

  const handleEditNote = (id: number) => {
    if (editNote.trim() === "") {
      handleDelete(id);
    } else {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === id ? { ...note, content: editNote, isEdited: true } : note
        )
      );
      setEditId(undefined);
      setEditNote("");
    }
  };

  const handleDelete = (id: number) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const handleEdit = (id: number) => {
    setEditId(id);
    setEditNote(notes.find((note) => note.id === id)?.content || "");
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-400 flex items-center justify-center gap-2">
          📄 <span>Quick Notes</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Your simple space for capturing thoughts.
        </p>
      </div>

      {/* Note Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-2">Add a New Note</h2>
        <p className="text-gray-500 mb-4">What&apos;s on your mind?</p>
        <textarea
          onChange={(e) => setNote(e.target.value)}
          value={note}
          placeholder="Type your note here..."
          className=" text-gray-600 w-full p-4 rounded-md bg-blue-50 border border-blue-100 focus:outline-none focus:ring focus:ring-blue-200 mb-4"
          rows={4}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleClick();
            }}}
        ></textarea>
        <button
          onClick={handleClick}
          className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 shadow"
        >
          <span className="text-2xl">+</span> Add Note
        </button>
      </div>

      <h2 className="text-2xl font-semibold mt-10 text-center">Your Notes</h2>
      {notes.length === 0 && (
        <p className="text-gray-500 text-center mt-16">
          No notes yet. Add your first one above !
        </p>
      )}
      {loading && <p className="text-gray-500 text-center mt-16">Loading...</p> }
      {notes.map((note) =>
        note.id !== editId ? (
          <div
            key={note.id}
            onDoubleClick={() => handleEdit(note.id)}
            className="bg-white shadow-xl min-h-32 px-8 rounded-lg p-3 w-full max-w-xl mt-2 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400 mt-2 ">
                <code className="mr-2">
                  Id: {note.id + 1}
                </code>
                <code>{note.isEdited ? "Edited" : ""}</code>
              </span>

              <span>
                <ClearIcon
                  onClick={() => handleDelete(note.id)}
                  sx={{ fontSize: 24 }}
                  className="cursor-pointer text-red-400 hover:text-red-500"
                />
              </span>
            </div>
            <div className="text-gray-600 text-l whitespace-pre-wrap break-words">
              {note.content}
            </div>
            <code className="flex text-xs text-gray-400 justify-end">
              {note.createdAt.toLocaleString()}
            </code>
          </div>
        ) : (
          <ClickOutside
            onClickOutside={() => setEditId(undefined)}
            key={note.id}
          >
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl mt-2">
              <textarea
                onChange={(e) => setEditNote(e.target.value)}
                value={editNote}
                placeholder="Type your note here..."
                className=" text-gray-600 w-full p-4 rounded-md bg-blue-50 border border-blue-100 focus:outline-none focus:ring focus:ring-blue-200 mb-4"
                rows={4}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleEditNote(note.id)
                  }}}
              ></textarea>
              <button
                onClick={() => handleEditNote(note.id)}
                className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 shadow"
              >
                Edit Note
              </button>
            </div>
          </ClickOutside>
        )
      )}
    </div>
  );
}
