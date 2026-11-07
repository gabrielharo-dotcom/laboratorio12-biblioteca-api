import { z } from 'zod';
const optionalText = z.string().trim().max(5000).nullable().optional();
const year = z.number().int().min(1).max(9999).nullable().optional();
export const authorSchema = z.object({
  name: z.string().trim().min(3, 'El nombre debe tener al menos 3 caracteres').max(200),
  email: z.string().trim().email().max(254),
  bio: optionalText,
  nationality: z.string().trim().max(100).nullable().optional(),
  birthYear: year,
}).strict();
export const bookSchema = z.object({
  title: z.string().trim().min(3, 'El título debe tener al menos 3 caracteres').max(300),
  description: optionalText,
  isbn: z.string().trim().min(1).max(40).nullable().optional(),
  publishedYear: year,
  genre: z.string().trim().max(100).nullable().optional(),
  pages: z.number().int().positive().max(1000000).nullable().optional(),
  authorId: z.string().trim().min(1),
}).strict();
export const authorUpdate = authorSchema.partial().refine(v => Object.keys(v).length > 0, 'No hay cambios');
export const bookUpdate = bookSchema.partial().refine(v => Object.keys(v).length > 0, 'No hay cambios');
export const searchSchema = z.object({
  search: z.string().max(300).default(''), genre: z.string().max(100).default(''),
  authorName: z.string().max(200).default(''), authorId: z.string().optional(),
  page: z.coerce.number().int().min(1).max(1000000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sortBy: z.enum(['title', 'publishedYear', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});
