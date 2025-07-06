import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  console.log('received signup requrest', email , password)
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "user",
    },
  });

  return NextResponse.json({ message: "User created", user });
}
