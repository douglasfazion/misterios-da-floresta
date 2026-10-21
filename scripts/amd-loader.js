/* Minimal, synchronous TypeScript AMD loader. All source modules are prebundled
   by `tsc --outFile`, in dependency order. No network loading is performed. */
(function(){
  const loaded=new Map();
  window.define=function(id,deps,factory){
    const exports={};
    function requireLocal(name){
      if(!loaded.has(name))throw Error(`Missing prebundled module: ${name}`);
      return loaded.get(name);
    }
    const args=deps.map(d=>d==='require'?requireLocal:d==='exports'?exports:requireLocal(d));
    const result=factory(...args);
    loaded.set(id,result===undefined?exports:result);
  };
})();
