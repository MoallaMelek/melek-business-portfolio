import assert from 'node:assert/strict';
import {test} from 'node:test';
import {withServer} from './server-head.test.mjs';
test('public page aliases and nested demos resolve',async()=>{
 await withServer(async origin=>{
  for(const route of ['/','/menu','/demos/overdozz/','/demos/bol-miette/']){
   const response=await fetch(origin+route);
   assert.equal(response.status,200,route);
   assert.match(response.headers.get('content-type'),/text\/html/);
  }
 });
});
test('configuration files and malformed paths stay unavailable',async()=>{
 await withServer(async origin=>{
  for(const route of ['/package.json','/.git/config','/assets/%2e%2e%5cserver.mjs','/assets/missing.png'])
   assert.equal((await fetch(origin+route)).status,404,route);
  assert.equal((await fetch(origin+'/%FF')).status,400);
 });
});
