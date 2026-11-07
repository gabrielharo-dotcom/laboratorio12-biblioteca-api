export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { api, HttpError, type IdContext } from '@/lib/http';
export const GET = api(async (_: Request, { params }: IdContext) => {
 const id = (await params).id;
 if (!await prisma.author.findUnique({ where: { id } })) throw new HttpError(404, 'Autor no encontrado');
 return NextResponse.json(await prisma.book.findMany({ where: { authorId: id }, orderBy: { publishedYear: 'asc' } }));
});

