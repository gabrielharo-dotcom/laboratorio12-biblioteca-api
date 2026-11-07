import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { api } from '@/lib/http';
export const GET = api(async () => {
 const [authors, genres, totalBooks] = await prisma.$transaction([
 prisma.author.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { books: true } } } }),
 prisma.book.findMany({ distinct: ['genre'], select: { genre: true }, where: { genre: { not: null } }, orderBy: { genre: 'asc' } }),
 prisma.book.count()
 ]);
 return NextResponse.json({ authors, genres: genres.map(g => g.genre).filter(Boolean), totalBooks });
});

