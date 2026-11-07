# Folio · Biblioteca
Laboratorio 12 de Desarrollo de Aplicaciones Web Avanzado. Next.js App Router, TypeScript, Prisma 7 y PostgreSQL en Supabase.

- Web: https://folio-biblioteca-lab12.vercel.app
- Repositorio: https://github.com/gabrielharo-dotcom/laboratorio12-biblioteca-api

## Ejecutar en Windows
1. Abrir una terminal en esta carpeta.
2. Ejecutar `npm install`.
3. Copiar `.env.example` a `.env` y completar DATABASE_URL con la conexión Session pooler de Supabase.
4. Ejecutar `npm run db:push` para crear las tablas y `npm run db:seed` para cargar 3 autores y 13 libros.
5. Ejecutar `npm run dev` y abrir http://localhost:3000.

La contraseña debe codificarse para una URL. El .env está excluido de Git. El certificado CA oficial de Supabase está en certs/ y se utiliza para verificar TLS. No se necesitan claves públicas ni service_role.

## Rutas
| Ruta | Métodos | Función |
| --- | --- | --- |
| /api/authors | GET, POST | Listar y crear autores |
| /api/authors/[id] | GET, PUT, DELETE | Consultar, actualizar y eliminar autor |
| /api/authors/[id]/books | GET | Obtener libros del autor |
| /api/authors/[id]/stats | GET | Total, años, promedio, géneros y extremos |
| /api/books | GET, POST | Listar, filtrar y crear libros |
| /api/books/[id] | GET, PUT, DELETE | Consultar, actualizar y eliminar libro |
| /api/books/search | GET | Búsqueda combinada, ordenamiento y paginación |
| /api/catalog | GET | Autores, géneros disponibles y total de libros |

La búsqueda acepta search, genre, authorName, page (1), limit (10, máximo 50), sortBy (title, publishedYear, createdAt) y order (asc, desc). Se añade authorId para el selector exacto de la interfaz. Los parámetros inválidos devuelven HTTP 400. Eliminar un autor elimina sus libros por la relación Cascade indicada en la guía.

Las estadísticas omiten los valores nulos al calcular años y páginas. Si el autor no tiene valores disponibles, se devuelve null; los géneros se devuelven sin duplicados.

## Pantallas
- /: dashboard con totales y CRUD de autores.
- /books: CRUD de libros, búsqueda con debounce, filtros, ordenamiento y navegación de páginas.
- /authors/[id]: información completa, estadísticas, obras y formularios de edición y nuevo libro.

## Verificación
- `npm run lint`
- `npm run build`
- Importar `postman/Biblioteca-Lab12.postman_collection.json` en Postman y ejecutar en orden.
- También: `npx newman run postman/Biblioteca-Lab12.postman_collection.json`.
- Cambiar la variable de colección baseUrl para probar Vercel.

Se ejecutaron 33 pruebas de integración y la colección Postman mediante Newman (13 solicitudes, 15 aserciones). Los resultados completos están en la carpeta evidencias contigua al proyecto.

## Despliegue
Importar el repositorio en Vercel como Next.js y configurar DATABASE_URL como variable sensible de Production y Preview. El build genera Prisma Client automáticamente y el certificado se incluye mediante outputFileTracingIncludes.

## Referencias
- Guía de laboratorio GLAB-S12-EAREVALO-2026-1.
- https://nextjs.org/docs/app/getting-started/route-handlers
- https://www.prisma.io/docs/guides/v7/frameworks/nextjs
- https://supabase.com/docs/guides/database/connecting-to-postgres

