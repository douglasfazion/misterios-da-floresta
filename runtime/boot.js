// v0.5.0: Offline double-click must work without network or any installation.
// When hosted at http(s), load actual Phaser 3.90.0 and the compiled TypeScript scenes.
// If Phaser cannot be fetched, automatically start the independent local offline game.
(()=>{
 const mode=document.getElementById('mode');
 const canvas=document.getElementById('game');
 let launched=false;
 function fallback(reason){
   if(launched)return;
   launched=true;
   canvas.style.display='block';
   mode.textContent='· modo offline';
   if(reason)console.warn('JOCA: Phaser indisponível; iniciando modo offline:',reason);
   const script=document.createElement('script');script.src='runtime/offline-game.js';
   script.onerror=()=>{const e=document.getElementById('boot-error');e.hidden=false;e.textContent='Não foi possível iniciar o jogo. Extraia o ZIP inteiro antes de abrir index.html.'};
   document.body.appendChild(script);
 }
 if((location.protocol!=='http:'&&location.protocol!=='https:') || new URL(location.href).searchParams.has('offline')){fallback();return;}
 canvas.style.display='none';
 function tryRuntime(path,onFailure){
   const script=document.createElement('script');script.src=path;
   script.onload=()=>{
     if(!window.Phaser){onFailure();return;}
     import('./phaser/phaser/main.js').then(m=>m.startGame(document.getElementById('phaser-mount')))
       .then(()=>{launched=true;mode.textContent='· Phaser 3';window.__JOCA_ENGINE__='Phaser 3';})
       .catch(err=>{console.error(err);fallback(err.message)});
   };
   script.onerror=onFailure;
   document.head.appendChild(script);
 }
 // GitHub Actions copies the npm-installed Phaser runtime to vendor/.
 // With no local runtime, the browser can try the CDN; offline double-click uses Canvas directly.
 tryRuntime('vendor/phaser.min.js',()=>tryRuntime(
   'https://cdnjs.cloudflare.com/ajax/libs/phaser/3.90.0/phaser.min.js',
   ()=>fallback('biblioteca Phaser indisponível')));
 // A stalled external CDN should not leave a blank game forever.
 setTimeout(()=>{if(!launched&&!window.Phaser)fallback('tempo limite da biblioteca Phaser')},6500);
})();
