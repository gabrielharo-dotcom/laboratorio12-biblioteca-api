import 'dotenv/config';
import { prisma } from '../lib/prisma';
async function main() {
 const authors = [
 { name:'Gabriel García Márquez', email:'gabo@example.com', nationality:'Colombia', birthYear:1927, bio:'Premio Nobel de Literatura 1982. Una de las voces más reconocidas del realismo mágico.', books:[
 ['Cien años de soledad',1967,'Novela',417,'978-0307474728','La historia de la familia Buendía y el universo de Macondo.'],
 ['El amor en los tiempos del cólera',1985,'Novela',368,'978-0307389732','Una historia de amor que resiste el paso del tiempo.'],
 ['La hojarasca',1955,'Novela',128,'978-0307477514','Tres generaciones frente a la memoria de un pueblo.'],
 ['Relato de un náufrago',1970,'Periodismo',110,'978-0307475381','La crónica de una supervivencia extraordinaria.'],
 ['Doce cuentos peregrinos',1992,'Cuento',232,'978-0307475374','Doce relatos sobre latinoamericanos en Europa.'],
 ['El coronel no tiene quien le escriba',1961,'Novela',104,'978-0307475446','La espera y la dignidad en un pequeño pueblo.']] },
 { name:'Isabel Allende', email:'isabel@example.com', nationality:'Chile', birthYear:1942, bio:'Escritora chilena de novelas que entrelazan memoria, familia e historia latinoamericana.', books:[
 ['La casa de los espíritus',1982,'Novela',480,'978-0525433477','La historia de la familia Trueba a través de varias generaciones.'],
 ['Eva Luna',1987,'Novela',320,'978-0307477226','Una narradora transforma su vida a través de las historias.'],
 ['Paula',1994,'Memorias',368,'978-0063021785','Un recorrido íntimo por la memoria y los vínculos familiares.'],
 ['Cuentos de Eva Luna',1989,'Cuento',288,'978-0307477233','Historias de personajes extraordinarios en la vida cotidiana.']] },
 { name:'Julio Cortázar', email:'julio@example.com', nationality:'Argentina', birthYear:1914, bio:'Maestro del cuento y la literatura fantástica. Su obra propone nuevas maneras de leer y de mirar lo cotidiano.', books:[
 ['Rayuela',1963,'Novela',600,'978-8437604572','Una novela abierta a múltiples recorridos de lectura.'],
 ['Bestiario',1951,'Cuento',168,'978-8437604480','Lo fantástico irrumpe en escenarios cotidianos.'],
 ['Final del juego',1956,'Cuento',200,'978-8437604589','Relatos que exploran los límites entre juego y realidad.']] },
 ];
 for (const {books,...a} of authors) {
  const author=await prisma.author.upsert({where:{email:a.email},update:{},create:a});
  for(const [title,publishedYear,genre,pages,isbn,description] of books)await prisma.book.upsert({
   where:{isbn:String(isbn)},update:{},create:{title:String(title),publishedYear:Number(publishedYear),genre:String(genre),pages:Number(pages),isbn:String(isbn),description:String(description),authorId:author.id}
  });
 }
 console.log('Datos de ejemplo listos: 3 autores y 13 libros.');
}
main().catch(e=>{console.error(e.message);process.exitCode=1;}).finally(()=>prisma.$disconnect());
