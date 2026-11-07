export type Author = { id: string; name: string; email: string; bio: string | null; nationality: string | null; birthYear: number | null; _count?: { books: number }; books?: Book[] };
export type Book = { id: string; title: string; description: string | null; isbn: string | null; genre: string | null; pages: number | null; publishedYear: number | null; authorId: string; author?: Author };
export type Stats = { totalBooks: number; firstBook: {title:string;year:number}|null; latestBook: {title:string;year:number}|null; averagePages:number|null; genres:string[]; longestBook:{title:string;pages:number}|null; shortestBook:{title:string;pages:number}|null };
export async function request<T>(url: string, options?: RequestInit): Promise<T> {
 const response = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } });
 const data = await response.json();
 if (!response.ok) throw new Error(data.error || 'Error al procesar la solicitud');
 return data;
}

