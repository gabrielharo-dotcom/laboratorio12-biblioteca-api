import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { api } from '@/lib/http';
import { bookSchema } from '@/lib/validation';
export const GET = api(async (request: Request) => {
 const q = new URL(request.url).searchParams;
 return NextResponse.json(await prisma.book.findMany({ where: { ...(q.get('genre') ? { genre: q.get('genre')! } : {}), ...(q.get('authorId') ? { authorId: q.get('authorId')! } : {}) }, include: { author: true }, orderBy: { createdAt: 'desc' } }));
});
export const POST = api(async (request: Request) => NextResponse.json(await prisma.book.create({ data: bookSchema.parse(await request.json()), include: { author: true } }), { status: 201 }));

