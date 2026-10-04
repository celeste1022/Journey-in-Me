// Motion follows an action: navigation, selection, or a changed surface.
export const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease='cubic-bezier(.22,.68,0,1)';
let lastRoute='',lastAction='',direction=1,positions=new Map();
export function motionIntent(action,back=false){lastAction=action||'';direction=back?-1:1}
export function beforeRender(root,route){
 const content=root.querySelector('.content');
 const active=document.activeElement;
 const focus=active&&root.contains(active)?{action:active.dataset.action,id:active.dataset.id,value:active.dataset.value,index:active.dataset.index,name:active.name,label:active.getAttribute('aria-label')}:null;
 if(content&&lastRoute)positions.set(lastRoute,content.scrollTop);
 const activeTab=root.querySelector('.major-tabs .active');
 const tabRect=activeTab?.getBoundingClientRect();
 const tabsRect=activeTab?.parentElement.getBoundingClientRect();
 return {same:route===lastRoute,top:content?.scrollTop||0,focus,tab:tabRect&&tabsRect?{x:tabRect.x-tabsRect.x,w:tabRect.width}:null,scrolls:[...root.querySelectorAll('.chip-tabs')].map(e=>e.scrollLeft)};
}
export function afterRender(root,route,before){
 const view=root.querySelector('.view'),content=root.querySelector('.content');
 if(content)content.scrollTop=before.same?before.top:direction<0?(positions.get(route)||0):0;
 root.querySelectorAll('.chip-tabs').forEach((el,i)=>el.scrollLeft=before.same?before.scrolls[i]||0:0);
 if(!before.same){
  view?.animate(reduceMotion()?[{opacity:.55},{opacity:1}]:[{opacity:0,transform:`translateX(${direction*16}px)`},{opacity:1,transform:'translateX(0)'}],{duration:reduceMotion()?100:280,easing:ease});
  const title=root.querySelector('h1');if(title){title.tabIndex=-1;title.focus({preventScroll:true})}
 }else{
  const f=before.focus;
  if(f){const target=[...root.querySelectorAll('button,input,textarea,select')].find(e=>f.name?e.name===f.name:f.action?e.dataset.action===f.action&&e.dataset.id===f.id&&e.dataset.value===f.value&&e.dataset.index===f.index:f.label&&e.getAttribute('aria-label')===f.label);target?.focus({preventScroll:true})}
  if(!reduceMotion()){
   let targets=[];
   if(/template/.test(lastAction))targets=[root.querySelector('.template-paper'),root.querySelector('.template-caption')];
   else if(/speaker-next|speaker-prev/.test(lastAction))targets=[root.querySelector('.speaker-carousel .speaker-art,.speaker-carousel .speaker-pending')];
   else if(/digital-preview|physical-preview/.test(lastAction))targets=[root.querySelector('.album-hero,.physical-album')];
   else if(/flip-card/.test(lastAction))targets=[root.querySelector('.detail-card .paper-card')];
   else if(/expand-sound|preview-sound|close-sound/.test(lastAction))targets=[root.querySelector('.sound-tray')];
   else if(/library-type|library-status|selection-type|category/.test(lastAction))targets=[root.querySelector('.creation-grid,.sound-grid,.artist-grid,.bazaar-grid')];
   else if(/select|move-card/.test(lastAction))targets=[root.querySelector('.grid-cell.selected .selection-check')];
   targets.filter(Boolean).forEach(el=>el.animate(lastAction==='flip-card'?[{opacity:.5,transform:'perspective(800px) rotateY(-65deg)'},{opacity:1,transform:'perspective(800px) rotateY(0)'}]:[{opacity:.3,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:lastAction==='flip-card'?420:240,easing:ease}));
  }
 }
 const active=root.querySelector('.major-tabs .active');
 if(active){const parent=active.parentElement,r=active.getBoundingClientRect(),p=parent.getBoundingClientRect();const line=document.createElement('span');line.className='tab-indicator';line.style.left=r.x-p.x+'px';line.style.width=r.width+'px';parent.append(line);if(before.same&&before.tab&&!reduceMotion())line.animate([{transform:`translateX(${before.tab.x-(r.x-p.x)}px) scaleX(${before.tab.w/r.width})`},{transform:'translateX(0) scaleX(1)'}],{duration:240,easing:ease});}
 lastRoute=route;lastAction='';direction=1;
}
export function animateDialog(dialog){dialog.animate(reduceMotion()?[{opacity:0},{opacity:1}]:[{opacity:0,transform:'translateY(14px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:reduceMotion()?100:240,easing:ease})}
export function installMotion(root){
 document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('button'))e.target.classList.add('key-pressed')});
 document.addEventListener('keyup',()=>document.querySelectorAll('.key-pressed').forEach(e=>e.classList.remove('key-pressed')));
 root.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key)||e.target.getAttribute('role')!=='tab')return;const tabs=[...e.target.parentElement.querySelectorAll('[role=tab]')],i=tabs.indexOf(e.target),next=tabs[(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];e.preventDefault();next?.click();root.querySelector('[role=tab][aria-selected=true]')?.focus({preventScroll:true});});
}
