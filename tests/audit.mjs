import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=path.resolve(import.meta.dirname,'..');
const pages=['index.html','elewacje-rzeszow.html','ocieplenia-rzeszow.html','druk-scienny.html','realizacje.html'];
const expectedUrls=pages.map(file=>file==='index.html'?'https://prym-rzeszow.pl/':`https://prym-rzeszow.pl/${file}`);
const errors=[];
const result={pages:{},images:{files:0,duplicates:0,brokenReferences:0,unused:0,totalBytes:0,dimensions:{}}};
const strip=s=>s.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'');
for(const file of pages){const html=fs.readFileSync(path.join(root,file),'utf8');const visible=strip(html);const pick=re=>html.match(re)?.[1]??'';const title=pick(/<title>([^<]+)<\/title>/i);const description=pick(/<meta\s+name="description"\s+content="([^"]+)"/i);const canonical=pick(/<link\s+rel="canonical"\s+href="([^"]+)"/i);const h1=(visible.match(/<h1\b/gi)||[]).length;const og=(html.match(/<meta\s+property="og:/gi)||[]).length;result.pages[file]={title,description,canonical,h1,og};if(!title||!description||!canonical||h1!==1||og<4)errors.push(`${file}: niekompletne metadane lub liczba H1 != 1`);if(/projekt do akceptacji|wersja demonstracyjna|przed publikacją|projekt demonstracyjny/i.test(visible))errors.push(`${file}: znaleziono komunikat demonstracyjny`);for(const match of html.matchAll(/(?:src|href)="([^"]+)"/gi)){const ref=match[1];if(/^(?:https?:|data:|#|mailto:|tel:|\/)/.test(ref))continue;const local=path.resolve(root,ref.split('#')[0].split('?')[0]);if(!fs.existsSync(local)){errors.push(`${file}: brak zasobu ${ref}`);if(/\.(?:webp|png|jpe?g)$/i.test(ref))result.images.brokenReferences++}}
const ld=[...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];for(const [,json] of ld){try{JSON.parse(json)}catch{errors.push(`${file}: niepoprawny JSON-LD`)}}
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');for(const url of expectedUrls)if(!sitemap.includes(`<loc>${url}</loc>`))errors.push(`sitemap.xml: brak ${url}`);
const imageDir=path.join(root,'zdjecia');const files=fs.readdirSync(imageDir).filter(file=>file.endsWith('.webp'));result.images.files=files.length;const hashes=new Map();const referenced=new Set();for(const page of pages){const html=fs.readFileSync(path.join(root,page),'utf8');for(const match of html.matchAll(/(?:src|href)="(?:\/)?zdjecia\/([^"]+\.webp)"/gi))referenced.add(match[1])}
for(const file of files){const buffer=fs.readFileSync(path.join(imageDir,file));result.images.totalBytes+=buffer.length;const hash=crypto.createHash('sha256').update(buffer).digest('hex');if(hashes.has(hash))result.images.duplicates++;else hashes.set(hash,file);const dim=webpSize(buffer);result.images.dimensions[file]=dim;if(!dim)errors.push(`nie można odczytać wymiarów ${file}`)}result.images.unused=files.filter(file=>!referenced.has(file)).length;
function webpSize(b){if(b.toString('ascii',0,4)!=='RIFF'||b.toString('ascii',8,12)!=='WEBP')return null;const type=b.toString('ascii',12,16);if(type==='VP8X')return {width:1+b.readUIntLE(24,3),height:1+b.readUIntLE(27,3)};if(type==='VP8 '){const i=b.indexOf(Buffer.from([0x9d,0x01,0x2a]),20);if(i>0)return {width:b.readUInt16LE(i+3)&0x3fff,height:b.readUInt16LE(i+5)&0x3fff}}if(type==='VP8L'){const bits=b.readUInt32LE(21);return {width:1+(bits&0x3fff),height:1+((bits>>14)&0x3fff)}}return null}
console.log(JSON.stringify(result,null,2));if(errors.length){console.error('\nBŁĘDY:\n'+errors.join('\n'));process.exit(1)}console.log('\nAudyt zakończony bez błędów.');

