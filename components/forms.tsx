'use client';
import { useState } from 'react';
import type { Author, Book } from '@/lib/types';
import { request } from '@/lib/types';
type Props = { onSaved: () => void; onCancel?: () => void };
export function AuthorForm({ author, onSaved, onCancel }: Props & { author?: Author }) {
 const [busy,setBusy] = useState(false), [error,setError] = useState('');
 return <form className="form-grid" onSubmit={async e => { e.preventDefault(); setBusy(true);setError('');
 const f = new FormData(e.currentTarget); const data = Object.fromEntries(f);
 try { await request('/api/authors' + (author ? '/' + author.id : ''), {method:author?'PUT':'POST',body:JSON.stringify({...data,birthYear:f.get('birthYear')?Number(f.get('birthYear')):null})}); onSaved(); } catch(e){setError((e as Error).message);}finally{setBusy(false);}
 }}>
 <label>Nombre completo<input name="name" required minLength={3} defaultValue={author?.name} placeholder="Gabriel García Márquez"/></label>
 <label>Correo electrónico<input name="email" type="email" required defaultValue={author?.email} placeholder="gabo@example.com"/></label>
 <label>Nacionalidad<input name="nationality" defaultValue={author?.nationality??''} placeholder="Colombia"/></label>
 <label>Año de nacimiento<input name="birthYear" type="number" min="1" max="9999" defaultValue={author?.birthYear??''}/></label>
 <label className="full">Biografía<textarea name="bio" rows={3} defaultValue={author?.bio??''}/></label>
 {error&&<p role="alert" className="error full">{error}</p>}
 <div className="actions full"><button disabled={busy}>{busy?'Guardando…':author?'Guardar cambios':'Crear autor'}</button>{onCancel&&<button type="button" className="secondary" onClick={onCancel}>Cancelar</button>}</div>
 </form>;
}
export function BookForm({ book, authors, authorId, onSaved, onCancel }: Props & { book?:Book; authors:Author[]; authorId?:string }) {
 const [busy,setBusy] = useState(false), [error,setError] = useState('');
 return <form className="form-grid" onSubmit={async e => { e.preventDefault();setBusy(true);setError('');
 const f=new FormData(e.currentTarget);const data:Record<string,unknown>=Object.fromEntries(f);
 for(const key of ['pages','publishedYear'])data[key]=f.get(key)?Number(f.get(key)):null;
 if(!f.get('isbn'))data.isbn=null;
 try{await request('/api/books'+(book?'/'+book.id:''),{method:book?'PUT':'POST',body:JSON.stringify(data)});onSaved();}catch(e){setError((e as Error).message);}finally{setBusy(false);}
 }}>
 <label className="full">Título<input name="title" required minLength={3} defaultValue={book?.title} placeholder="Cien años de soledad"/></label>
 <label>Autor<select name="authorId" required defaultValue={book?.authorId??authorId??''}><option value="" disabled>Selecciona un autor</option>{authors.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
 <label>Género<input name="genre" defaultValue={book?.genre??''} placeholder="Novela"/></label>
 <label>ISBN<input name="isbn" defaultValue={book?.isbn??''}/></label>
 <label>Año de publicación<input name="publishedYear" type="number" min="1" max="9999" defaultValue={book?.publishedYear??''}/></label>
 <label>Páginas<input name="pages" type="number" min="1" max="1000000" defaultValue={book?.pages??''}/></label>
 <label className="full">Descripción<textarea name="description" rows={3} defaultValue={book?.description??''}/></label>
 {error&&<p role="alert" className="error full">{error}</p>}
 <div className="actions full"><button disabled={busy||!authors.length}>{busy?'Guardando…':book?'Guardar cambios':'Crear libro'}</button>{onCancel&&<button type="button" className="secondary" onClick={onCancel}>Cancelar</button>}</div>
 </form>;
}
export function Modal({ title, children, onClose }: { title:string;children:React.ReactNode;onClose:()=>void }) {
 return <div className="overlay" onClick={onClose}><section role="dialog" aria-modal="true" aria-label={title} className="modal" onClick={e=>e.stopPropagation()}><div className="section-head"><h2>{title}</h2><button className="secondary" onClick={onClose} aria-label="Cerrar">✕</button></div>{children}</section></div>;
}

