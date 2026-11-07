import { NextResponse } from 'next/server';
import { Prisma } from '@/app/generated/prisma/client';
import { z } from 'zod';

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function api<T extends unknown[]>(fn: (...args: T) => Promise<Response>) {
  return async (...args: T) => {
    try { return await fn(...args); }
    catch (error) {
      if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status });
      if (error instanceof z.ZodError) return NextResponse.json({ error: 'Datos inválidos', details: error.flatten() }, { status: 400 });
      if (error instanceof SyntaxError) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') return NextResponse.json({ error: 'El correo o ISBN ya existe' }, { status: 409 });
        if (error.code === 'P2025') return NextResponse.json({ error: 'Registro no encontrado' }, { status: 404 });
        if (error.code === 'P2003') return NextResponse.json({ error: 'El autor especificado no existe' }, { status: 404 });
      }
      console.error('API error:', error instanceof Error ? error.message : 'Unknown error');
      return NextResponse.json({ error: 'No se pudo completar la operación. Revisa la conexión de la base de datos.' }, { status: 500 });
    }
  };
}
export type IdContext = { params: Promise<{ id: string }> };
