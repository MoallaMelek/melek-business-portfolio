import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from '../server.mjs';

export async function withServer(run) {
  const server=createServer();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise(resolve=>server.close(resolve)); }
}

test('HEAD returns the same resource metadata without a response body',async()=>{
  await withServer(async origin=>{
    const get=await fetch(origin);
    const head=await fetch(origin,{method:'HEAD'});
    assert.equal(head.status,200);
    assert.equal(head.headers.get('content-type'),get.headers.get('content-type'));
    assert.equal(await head.text(),'');
  });
});
