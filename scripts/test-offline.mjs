import {execFileSync} from 'node:child_process';
import {writeFile,mkdir} from 'node:fs/promises';
await mkdir('.test-build',{recursive:true});
execFileSync('tsc',['-p','tests/tsconfig.offline.json'],{stdio:'inherit'});
await writeFile('.test-build/package.json','{"type":"commonjs"}\n');
execFileSync('node',['--test','tests/offline.test.cjs'],{stdio:'inherit'});
