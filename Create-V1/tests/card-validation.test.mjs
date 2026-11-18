import test from 'node:test';
import assert from 'node:assert/strict';
import {cardErrors} from '../dist/card-validation.js';

const complete = {name:'A morning',photo:'art:0',words:'Keep this light.',recording:'demo',sound:'sound-0',mixed:true};

test('a template preview and whitespace do not satisfy required content',()=>{
  assert.deepEqual(Object.keys(cardErrors({name:'  ',words:'\n ',art:0,mixed:false})),['name','photo','words','sound']);
});
test('either audio source is enough and mixing is optional',()=>{
  assert.deepEqual(cardErrors({...complete,recording:null,mixed:false}),{});
  assert.deepEqual(cardErrors({...complete,sound:null,mixed:false}),{});
  assert.deepEqual(cardErrors({...complete,mixed:false}),{});
  assert.ok(cardErrors({...complete,recording:null,sound:null,mixed:true}).sound);
});
test('each completed required field clears only its own error',()=>{
  const draft={name:complete.name,photo:null,words:'',recording:null};
  assert.deepEqual(Object.keys(cardErrors(draft)),['photo','words','sound']);
  assert.deepEqual(Object.keys(cardErrors({...draft,photo:'art:0'})),['words','sound']);
  assert.deepEqual(Object.keys(cardErrors({...draft,photo:'art:0',words:complete.words})),['sound']);
});
test('complete cards pass for every shared editor entry, without changing content',()=>{
  for(const source of ['memory','gift','simple','album']){
    const card=Object.freeze({...complete,source});
    assert.deepEqual(cardErrors(card),{});
  }
});
