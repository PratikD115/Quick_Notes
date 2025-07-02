"use client";

import { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import ClickOutside from "@/components/ClickOutside";
import ArticleIcon from '@mui/icons-material/Article';
import AddIcon from '@mui/icons-material/Add';
import { Button } from "@/components/ui/button"
import { AlertBox } from "@/components/AlertBox";

type Note = {
  id: number;
  content: string;
  createdAt: Date;
  isEdited: boolean;
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState<string>("");
  const [editId, setEditId] = useState<number | undefined>();
  const [editNote, setEditNote] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/notes");
        const data = await res.json();
        setNotes(data);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleClick = async () => {
    if (note.trim() === "") return;

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify({ content: note.trim() }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const newNote = await res.json();
      console.log("newNote", newNote);

      setNotes((prev) => [newNote, ...prev]);
    } catch (err) {
      console.error("Failed to create note:", err);
    }
    setNote("");
  };

  const handleEditNote = async (id: number) => {
    if (editNote.trim() === "") {
      handleDelete(id);
    } else {
      try {
        const res = await fetch(`/api/notes/${id}`, {
          method: "PUT",
          body: JSON.stringify({ content: editNote }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const updatedNote = await res.json();

        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === id ? updatedNote : note))
        );
      } catch (err) {
        console.error("Failed to update note:", err);
      }
      setEditId(undefined);
      setEditNote("");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete note");
      }
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditModeOpen = (id: number) => {
    setEditId(id);
    setEditNote(notes.find((note) => note.id === id)?.content || "");
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
          <ArticleIcon sx={{ fontSize: 40 }} /> <span>Quick Notes</span>
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
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleClick();
            }
          }}
        ></textarea>
        <button
          onClick={handleClick}
          className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-md flex items-center justify-center gap-2 shadow"
        >
          <AddIcon sx={{ fontSize: 20 }} /> Add Note
        </button>
      </div>

      <h2 className="text-2xl font-semibold mt-10 text-center">Your Notes</h2>
      {notes.length === 0 && (
        <p className="text-gray-500 text-center mt-16">
          No notes yet. Add your first one above !
        </p>
      )}
      {loading && <p className="text-gray-500 text-center mt-16">Loading...</p>}
      {notes?.map((note: Note) =>
        note.id !== editId ? (
          <div
            key={note.id}
            onDoubleClick={() => handleEditModeOpen(note.id)}
            className="bg-white shadow-xl min-h-32 px-8 rounded-lg p-3 w-full max-w-xl mt-2 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400 mt-2 ">
                <code className="mr-2">Id: {note.id + 1}</code>
                <code>{note.isEdited ? "Edited" : ""}</code>
              </span>
              <AlertBox
                onDelete={() => handleDelete(note.id)}
                alertTitle="Delete Note"
                alertDescription="Do you really want to delete this note?"
              >
                <Button variant='ghost' size='icon'>
                  <ClearIcon sx={{ fontSize: 24 }} className="cursor-pointer text-primary"
                  />
                </Button>
              </AlertBox>

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
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleEditNote(note.id);
                  }
                }}
              ></textarea>
              <div className="flex justify-end items-end">
                <Button className="w-32" onClick={() => handleEditNote(note.id)}              >
                  Edit Note
                </Button></div>

            </div>
          </ClickOutside>
        )
      )
      }
    </div >
  );
}
