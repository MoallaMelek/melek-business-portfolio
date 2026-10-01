import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const publicFiles=new Set(['index.html','styles.css','app.js','menu.html','menu.css','menu.js','demo-ribbon.css','robots.txt','sitemap.xml']);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.mp4':'video/mp4','.txt':'text/plain'};
http.createServer((req,res)=>{
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end('Invalid URL');}
 const segments=pathname.split('/').filter(Boolean);
 if(segments.some(s=>s.startsWith('.')||s.includes('\\'))){res.writeHead(404);return res.end('Not found');}
 let relative=segments.join('/')||'index.html';
 if(relative==='menu')relative='menu.html';
 if(relative==='demos/overdozz'||relative==='demos/overdozz/')relative='demos/overdozz/index.html';
 if(relative==='demos/bol-miette'||relative==='demos/bol-miette/')relative='demos/bol-miette/index.html';
 if(!publicFiles.has(relative)&&!relative.startsWith('assets/')&&!relative.startsWith('demos/')){res.writeHead(404);return res.end('Not found');}
 const file=path.resolve(root,relative);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end('Not found');}
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});
 fs.createReadStream(file).on('error',()=>res.destroy()).pipe(res);
}).listen(4173,'127.0.0.1',()=>console.log('Portfolio available at http://localhost:4173'));
