export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { api, HttpError, type IdContext } from '@/lib/http';
import { bookUpdate } from '@/lib/validation';
export const GET = api(async (_: Request, { params }: IdContext) => {
 const book = await prisma.book.findUnique({ where: { id: (await params).id }, include: { author: true } });
 if (!book) throw new HttpError(404, 'Libro no encontrado');
 return NextResponse.json(book);
});
export const PUT = api(async (request: Request, { params }: IdContext) => NextResponse.json(await prisma.book.update({ where: { id: (await params).id }, data: bookUpdate.parse(await request.json()), include: { author: true } })));
export const DELETE = api(async (_: Request, { params }: IdContext) => {
 await prisma.book.delete({ where: { id: (await params).id } });
 return NextResponse.json({ message: 'Libro eliminado correctamente' });
});

