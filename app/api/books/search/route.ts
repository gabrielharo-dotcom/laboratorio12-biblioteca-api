import { NextResponse } from 'next/server';
import { Prisma } from '@/app/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { api } from '@/lib/http';
import { searchSchema } from '@/lib/validation';
export const GET = api(async (request: Request) => {
 const q = searchSchema.parse(Object.fromEntries(new URL(request.url).searchParams));
 const where: Prisma.BookWhereInput = {
 ...(q.search ? { title: { contains: q.search, mode: 'insensitive' } } : {}),
 ...(q.genre ? { genre: q.genre } : {}),
 ...(q.authorName ? { author: { name: { contains: q.authorName, mode: 'insensitive' } } } : {}),
 ...(q.authorId ? { authorId: q.authorId } : {}),
 };
 const [data, total] = await prisma.$transaction([
 prisma.book.findMany({ where, include: { author: true }, skip: (q.page - 1) * q.limit, take: q.limit, orderBy: [{ [q.sortBy]: { sort: q.order, nulls: 'last' } }, { id: 'asc' }] }),
 prisma.book.count({ where }),
 ], { isolationLevel: 'RepeatableRead' });
 const totalPages = Math.ceil(total / q.limit);
 return NextResponse.json({ data, pagination: { page: q.page, limit: q.limit, total, totalPages, hasNext: q.page < totalPages, hasPrev: q.page > 1 } });
});

