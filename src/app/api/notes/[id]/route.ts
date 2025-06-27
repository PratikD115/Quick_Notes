import { NextResponse } from 'next/server';
import  prisma  from '../../../../../lib/prisma';



export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const noteId = Number(params.id);

  try {
    await prisma.note.delete({
      where: { id: noteId },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Note not found or deletion failed.' },
      { status: 500 }
    );
  }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    const noteId = Number(params.id);
    const body = await req.json();
  
    try {
      const updatedNote = await prisma.note.update({
        where: { id: noteId },
        data: {
          content: body.content,
          isEdited: true,
        },
      });
  
      return NextResponse.json(updatedNote);
    } catch {
      return NextResponse.json(
        { error: 'Note not found or update failed.' },
        { status: 500 }
      );
    }
  }