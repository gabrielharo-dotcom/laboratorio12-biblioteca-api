'use client';
import { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthorForm, BookForm, Modal } from '@/components/forms';
import { request, type Author, type Book, type Stats } from '@/lib/types';
export default function AuthorPage({ params }: {params:Promise<{id:string}>}){
 const {id}=use(params);const [author,setAuthor]=useState<Author|null>(null),[books,setBooks]=useState<Book[]>([]),[stats,setStats]=useState<Stats|null>(null),[error,setError]=useState(''),[editing,setEditing]=useState(false),[newBook,setNewBook]=useState(false);
 const load=useCallback(async()=>{try{const [a,b,s]=await Promise.all([request<Author>('/api/authors/'+id),request<Book[]>('/api/authors/'+id+'/books'),request<Stats>('/api/authors/'+id+'/stats')]);setAuthor(a);setBooks(b);setStats(s);setError('');}catch(e){setError((e as Error).message);}},[id]);
 useEffect(()=>{const timer=setTimeout(()=>void load(),0);return()=>clearTimeout(timer);},[load]);
 if(error)return <p className="error" role="alert">{error}</p>;
 if(!author||!stats)return <p role="status">Cargando autor…</p>;
 return <><Link className="text-link" href="/">← Todos los autores</Link><div className="page-head detail-head"><div><div className="eyebrow">{author.nationality||'AUTOR'} · {author.birthYear||'Año sin registrar'}</div><h1>{author.name}</h1><p>{author.email}</p></div><button className="secondary" onClick={()=>setEditing(true)}>Editar información</button></div><p className="author-bio">{author.bio||'Sin biografía registrada.'}</p>
 <div className="stats"><article><span>Libros publicados</span><strong>{stats.totalBooks}</strong></article><article><span>Primera publicación</span><strong>{stats.firstBook?.year??'—'}</strong><small>{stats.firstBook?.title??'Sin datos'}</small></article><article><span>Última publicación</span><strong>{stats.latestBook?.year??'—'}</strong><small>{stats.latestBook?.title??'Sin datos'}</small></article><article><span>Promedio de páginas</span><strong>{stats.averagePages??'—'}</strong></article></div>
 <section className="detail-stats"><div><h3>Géneros que explora</h3><p>{stats.genres.join(' · ')||'Sin géneros registrados'}</p></div><div><h3>Libro más extenso</h3><p>{stats.longestBook?stats.longestBook.title+' · '+stats.longestBook.pages+' páginas':'Sin datos'}</p></div><div><h3>Libro más breve</h3><p>{stats.shortestBook?stats.shortestBook.title+' · '+stats.shortestBook.pages+' páginas':'Sin datos'}</p></div></section>
 <div className="section-head"><h2>Obras del autor</h2><button onClick={()=>setNewBook(true)}>＋ Agregar libro</button></div>
 {books.length?<div className="table-wrap"><table><thead><tr><th>Título</th><th>Género</th><th>Año</th><th>Páginas</th><th>ISBN</th></tr></thead><tbody>{books.map(b=><tr key={b.id}><td><strong>{b.title}</strong><p>{b.description}</p></td><td>{b.genre||'—'}</td><td>{b.publishedYear??'—'}</td><td>{b.pages??'—'}</td><td>{b.isbn||'—'}</td></tr>)}</tbody></table></div>:<p className="empty">Este autor todavía no tiene libros.</p>}
 {editing&&<Modal title="Editar autor" onClose={()=>setEditing(false)}><AuthorForm author={author} onSaved={()=>{setEditing(false);void load();}} onCancel={()=>setEditing(false)}/></Modal>}
 {newBook&&<Modal title="Agregar libro al autor" onClose={()=>setNewBook(false)}><BookForm authors={[author]} authorId={id} onSaved={()=>{setNewBook(false);void load();}} onCancel={()=>setNewBook(false)}/></Modal>}
 </>;
}

