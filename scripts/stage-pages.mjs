import fs from 'node:fs';
const dest='site';fs.rmSync(dest,{recursive:true,force:true});fs.mkdirSync(dest,{recursive:true});
for(const f of ['index.html','style.css'])fs.copyFileSync(f,`${dest}/${f}`);
for(const dir of ['assets','runtime','vendor'])if(fs.existsSync(dir))fs.cpSync(dir,`${dest}/${dir}`,{recursive:true});
fs.writeFileSync(`${dest}/.nojekyll`,'');
console.log('Site pronto em',dest);
