import assert from 'node:assert/strict';
import {test} from 'node:test';
import {withServer} from './server-head.test.mjs';
test('POST and DELETE are rejected with an accurate Allow header',async()=>{
 await withServer(async origin=>{
  for(const method of ['POST','DELETE']){
   const response=await fetch(origin,{method});
   assert.equal(response.status,405);
   assert.equal(response.headers.get('allow'),'GET, HEAD');
  }
 });
});
