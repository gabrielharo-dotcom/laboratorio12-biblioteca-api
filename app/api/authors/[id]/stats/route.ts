export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { api, HttpError, type IdContext } from '@/lib/http';
export const GET = api(async (_: Request, { params }: IdContext) => {
 const author = await prisma.author.findUnique({ where: { id: (await params).id }, include: { books: { orderBy: { title: 'asc' } } } });
 if (!author) throw new HttpError(404, 'Autor no encontrado');
 const dated = author.books.filter(b => b.publishedYear !== null).sort((a,b) => a.publishedYear! - b.publishedYear!);
 const paged = author.books.filter(b => b.pages !== null).sort((a,b) => a.pages! - b.pages!);
 const first = dated[0], last = dated.at(-1), shortest = paged[0], longest = paged.at(-1);
 return NextResponse.json({ authorId: author.id, authorName: author.name, totalBooks: author.books.length,
 firstBook: first ? { title: first.title, year: first.publishedYear } : null,
 latestBook: last ? { title: last.title, year: last.publishedYear } : null,
 averagePages: paged.length ? Math.round(paged.reduce((sum,b) => sum + b.pages!,0) / paged.length * 100) / 100 : null,
 genres: [...new Set(author.books.map(b => b.genre).filter((g): g is string => !!g))].sort(),
 longestBook: longest ? { title: longest.title, pages: longest.pages } : null,
 shortestBook: shortest ? { title: shortest.title, pages: shortest.pages } : null });
});

