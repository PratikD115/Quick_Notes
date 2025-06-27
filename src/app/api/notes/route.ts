import { NextResponse } from 'next/server';
import  prisma  from '../../../../lib/prisma';

export async function GET() {
  try {
    const notes = await prisma.note.findMany();

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
    const body = await req.json();

    const newNote = await prisma.note.create({
      data: {
        content: body.content,
        isEdited: false,
      },
    });
  
    return NextResponse.json(newNote);
}
