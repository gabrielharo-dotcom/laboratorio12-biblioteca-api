import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.env.TEST_BASE_URL||'http://localhost:3000';
const results=[];
async function call(name,method,path,body,status=200,check=()=>{}){
 const start=Date.now();const response=await fetch(base+path,{method,headers:{'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
 const data=await response.json();assert.equal(response.status,status,name+': '+JSON.stringify(data));check(data);
 results.push({name,method,path,status:response.status,durationMs:Date.now()-start,response:data});
 console.log('OK '+name);return data;
}
let authorId, bookId;
try{
 await call('Listar autores','GET','/api/authors',null,200,d=>assert.ok(Array.isArray(d)));
 const a=await call('Crear autor','POST','/api/authors',{name:'Autor de prueba API',email:'api-'+Date.now()+'@example.com',nationality:'Perú',birthYear:1980,bio:'Registro temporal de pruebas'},201);authorId=a.id;
 await call('Correo duplicado','POST','/api/authors',{name:a.name,email:a.email},409);
 await call('Correo inválido','POST','/api/authors',{name:'Autor',email:'invalido'},400);
 await call('Obtener autor','GET','/api/authors/'+a.id,null,200,d=>assert.equal(d.name,a.name));
 await call('Actualizar autor parcialmente','PUT','/api/authors/'+a.id,{bio:'Biografía actualizada'},200,d=>assert.equal(d.email,a.email));
 await call('Libros de autor vacío','GET','/api/authors/'+a.id+'/books',null,200,d=>assert.equal(d.length,0));
 await call('Estadísticas sin libros','GET','/api/authors/'+a.id+'/stats',null,200,d=>{assert.equal(d.totalBooks,0);assert.equal(d.averagePages,null);assert.equal(d.firstBook,null);});
 const b=await call('Crear libro','POST','/api/books',{title:'Amor de prueba API',isbn:'test-'+Date.now(),publishedYear:2001,genre:'Prueba',pages:100,authorId:a.id},201);bookId=b.id;
 await call('ISBN duplicado','POST','/api/books',{title:'Otro título',isbn:b.isbn,authorId:a.id},409);
 await call('Páginas inválidas','POST','/api/books',{title:'Libro inválido',pages:0,authorId:a.id},400);
 await call('Autor inexistente','POST','/api/books',{title:'Libro sin autor',authorId:'no-existe'},404);
 await call('Listar libros','GET','/api/books',null,200,d=>assert.ok(d.length>=1));
 await call('Filtrar género exacto','GET','/api/books?genre=Prueba',null,200,d=>assert.ok(d.every(b=>b.genre==='Prueba')));
 await call('Obtener libro','GET','/api/books/'+b.id,null,200,d=>assert.equal(d.author.id,a.id));
 await call('Actualizar libro','PUT','/api/books/'+b.id,{pages:200},200,d=>assert.equal(d.pages,200));
 await call('Búsqueda combinada sin distinguir mayúsculas','GET','/api/books/search?search=AMOR&genre=Prueba&authorName=AUTOR%20DE%20PRUEBA&page=1&limit=1&sortBy=publishedYear&order=asc',null,200,d=>{assert.equal(d.data[0].id,b.id);assert.equal(d.pagination.total,1);assert.equal(d.pagination.hasNext,false);});
 await call('Paginación primera página','GET','/api/books/search?limit=5&page=1',null,200,d=>{assert.equal(d.data.length,5);assert.equal(d.pagination.hasNext,true);assert.equal(d.pagination.hasPrev,false);});
 await call('Paginación segunda página','GET','/api/books/search?limit=5&page=2',null,200,d=>{assert.equal(d.pagination.hasPrev,true);assert.equal(d.data.length,5);});
 await call('Búsqueda sin resultados','GET','/api/books/search?search=ningunlibroxyz',null,200,d=>{assert.equal(d.pagination.total,0);assert.equal(d.data.length,0);});
 for(const q of ['page=0','page=1.5','limit=51','limit=abc','sortBy=email','order=incorrecto'])await call('Validación '+q,'GET','/api/books/search?'+q,null,400);
 await call('Estadísticas calculadas','GET','/api/authors/'+a.id+'/stats',null,200,d=>{assert.equal(d.totalBooks,1);assert.equal(d.averagePages,200);assert.equal(d.firstBook.year,2001);assert.equal(d.longestBook.pages,200);});
 await call('Autor no encontrado','GET','/api/authors/no-existe',null,404);
 await call('Libro no encontrado','GET','/api/books/no-existe',null,404);
 await call('JSON mal formado','POST','/api/books',{title:123,authorId:a.id},400);
 await call('Eliminar libro','DELETE','/api/books/'+b.id,null,200);bookId=null;
 await call('Libro eliminado no existe','GET','/api/books/'+b.id,null,404);
 await call('Eliminar autor','DELETE','/api/authors/'+a.id,null,200);authorId=null;
 console.log('TOTAL: '+results.length+' pruebas satisfactorias.');
}finally{
 if(bookId)await fetch(base+'/api/books/'+bookId,{method:'DELETE'});
 if(authorId)await fetch(base+'/api/authors/'+authorId,{method:'DELETE'});
 fs.mkdirSync('../evidencias',{recursive:true});
 fs.writeFileSync('../evidencias/pruebas-api.json',JSON.stringify({base,date:new Date().toISOString(),passed:results.length,results},null,2));
}
