'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AuthorForm, Modal } from '@/components/forms';
import { request, type Author } from '@/lib/types';
export default function Dashboard() {
 const [authors,setAuthors]=useState<Author[]>([]),[books,setBooks]=useState(0),[genres,setGenres]=useState<string[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[editing,setEditing]=useState<Author|null|undefined>(undefined);
 const load=useCallback(async()=>{try{const d=await request<{authors:Author[];totalBooks:number;genres:string[]}>('/api/catalog');setAuthors(d.authors);setBooks(d.totalBooks);setGenres(d.genres);setError('');}catch(e){setError((e as Error).message);}finally{setLoading(false);}},[]);
 useEffect(()=>{const timer=setTimeout(()=>void load(),0);return()=>clearTimeout(timer);},[load]);
 return <><div className="eyebrow">TU BIBLIOTECA, CONECTADA</div><div className="page-head"><div><h1>Historias que conectan.</h1><p>Un lugar para descubrir autores y organizar sus obras.</p></div><button onClick={()=>setEditing(null)}>＋ Nuevo autor</button></div>
 <div className="stats"><article><span>Autores registrados</span><strong>{authors.length.toString().padStart(2,'0')}</strong><small>Voces de nuestra colección</small></article><article><span>Libros en el catálogo</span><strong>{books.toString().padStart(2,'0')}</strong><small>Historias por descubrir</small></article><article><span>Géneros literarios</span><strong>{genres.length.toString().padStart(2,'0')}</strong><small>Distintas formas de leer</small></article></div>
 <div className="section-head"><div><h2>Nuestros autores</h2><p>Explora su vida, sus libros y su huella literaria.</p></div><Link className="text-link" href="/books">Explorar catálogo →</Link></div>
 {error&&<p role="alert" className="error">{error} <button className="secondary" onClick={load}>Reintentar</button></p>}
 {loading?<p role="status">Cargando autores…</p>:authors.length?<div className="author-grid">{authors.map((a,i)=><article className="author-card" key={a.id}><div className={'avatar color-'+i%4}>{a.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div><div className="muted uppercase">{a.nationality||'Nacionalidad sin registrar'}</div><h3>{a.name}</h3><p className="bio">{a.bio||'Aún no se ha registrado una biografía.'}</p><div className="card-foot"><span>{a._count?.books??0} libros</span><span>{a.birthYear||'—'}</span></div><Link className="text-link" href={'/authors/'+a.id}>Ver autor y sus libros →</Link><div className="actions"><button className="secondary" onClick={()=>setEditing(a)}>Editar</button><button className="danger" onClick={async()=>{if(!confirm('¿Eliminar a '+a.name+' y todos sus libros?'))return;try{await request('/api/authors/'+a.id,{method:'DELETE'});await load();}catch(e){setError((e as Error).message);}}}>Eliminar</button></div></article>)}</div>:!error&&<div className="empty"><h3>Una biblioteca empieza con un autor.</h3><p>Agrega el primero para comenzar tu colección.</p></div>}
 {editing!==undefined&&<Modal title={editing?'Editar autor':'Nuevo autor'} onClose={()=>setEditing(undefined)}><AuthorForm author={editing??undefined} onSaved={()=>{setEditing(undefined);void load();}} onCancel={()=>setEditing(undefined)}/></Modal>}
 </>;
}

