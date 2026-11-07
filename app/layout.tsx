import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
export const metadata: Metadata = { title: 'Folio | Biblioteca', description: 'Biblioteca de autores y libros con Next.js, Prisma y Supabase.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return <html lang="es"><body><header className="topbar"><Link href="/" className="brand"><span className="brand-icon">F</span> folio.</Link><nav aria-label="Navegación principal"><Link href="/">Autores</Link><Link href="/books">Catálogo de libros</Link></nav><span className="project-tag">BIBLIOTECA DIGITAL</span></header><main>{children}</main><footer><span>folio. Cada libro, una nueva perspectiva.</span><span>Laboratorio 12 · Next.js + Prisma + Supabase</span></footer></body></html>;
}
