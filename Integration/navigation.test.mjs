import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync(new URL('./navigation.js',import.meta.url),'utf8');
function fixture(path='/Journey-in-Me/home/'){
  const handlers={};let destination;
  const doc={currentScript:{src:'https://example.com/Journey-in-Me/journey-navigation.js'},documentElement:{dataset:{}},head:{append(){}},body:{},createElement:()=>({}),querySelectorAll:()=>[],addEventListener:(name,fn)=>handlers[name]=fn};
  const location={pathname:path,search:'',href:'https://example.com'+path,assign:url=>destination=url};
  const win={document:doc,location,queueMicrotask,MutationObserver:class{observe(){}}};win.top=win;
  runInNewContext(source,{document:doc,window:win,location,URL,URLSearchParams});
  return {click:({label='',go=null,hot=false,nav=true})=>{
    const el={textContent:label,tagName:'BUTTON',closest:()=>nav?{}:null,getAttribute:n=>n==='data-go'?go:n==='aria-label'?label:null,matches:s=>s==='.hot'&&hot};
    let stopped=false;handlers.click({target:{closest:()=>el},preventDefault(){},stopImmediatePropagation(){stopped=true}});
    return {destination,stopped};
  }};
}
for(const [label,target] of [['Practice','practice/'],['Create','create/#/create'],['Share','share/']])test('Home → '+label,()=>assert.equal(fixture().click({label}).destination,'https://example.com/Journey-in-Me/'+target));
test('selected Practice preserves local state',()=>assert.deepEqual(fixture('/Journey-in-Me/practice/').click({label:'Practice'}),{destination:undefined,stopped:false}));
test('Create placeholder Friends opens original My Friends',()=>assert.equal(fixture('/Journey-in-Me/create/').click({go:'friends',nav:false}).destination,'https://example.com/Journey-in-Me/my-friend/'));
test('Reflection opens Practice writing entry',()=>assert.equal(fixture('/Journey-in-Me/create/').click({go:'reflection',nav:false}).destination,'https://example.com/Journey-in-Me/practice/?entry=reflection'));
test('Practice image hotspot Home exits legacy overlay navigation',()=>assert.equal(fixture('/Journey-in-Me/practice/').click({label:'Home',hot:true,nav:false}).destination,'https://example.com/Journey-in-Me/home/'));
