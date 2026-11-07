import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { api } from '@/lib/http';
import { authorSchema } from '@/lib/validation';
export const GET = api(async () => NextResponse.json(await prisma.author.findMany({ include: { _count: { select: { books: true } } }, orderBy: { name: 'asc' } })));
export const POST = api(async (request: Request) => NextResponse.json(await prisma.author.create({ data: authorSchema.parse(await request.json()) }), { status: 201 }));

