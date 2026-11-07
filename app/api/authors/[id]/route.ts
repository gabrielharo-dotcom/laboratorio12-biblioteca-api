import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { api, HttpError, type IdContext } from '@/lib/http';
import { authorUpdate } from '@/lib/validation';
export const GET = api(async (_: Request, { params }: IdContext) => {
 const author = await prisma.author.findUnique({ where: { id: (await params).id }, include: { books: { orderBy: { title: 'asc' } } } });
 if (!author) throw new HttpError(404, 'Autor no encontrado');
 return NextResponse.json(author);
});
export const PUT = api(async (request: Request, { params }: IdContext) => NextResponse.json(await prisma.author.update({ where: { id: (await params).id }, data: authorUpdate.parse(await request.json()) })));
export const DELETE = api(async (_: Request, { params }: IdContext) => {
 await prisma.author.delete({ where: { id: (await params).id } });
 return NextResponse.json({ message: 'Autor eliminado correctamente' });
});

