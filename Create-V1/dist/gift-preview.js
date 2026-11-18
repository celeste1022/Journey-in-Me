export function giftPreviewMarkup({gift,cardMarkup,icon,esc}){
 return `<div class="view gift-cinema gift-finish" data-physical="${gift.kind==='set'}"><header class="cinema-top"><button class="icon-button" data-action="gift-preview-back" aria-label="Back to gift summary">${icon('chevron-left')}</button><span>A gift for ${esc(gift.recipient||'you')}</span><span class="cinema-header-spacer" aria-hidden="true"></span></header><div class="gift-film-body"><div class="gift-film-stage" role="img" aria-label="Your gift is being wrapped"><div class="gift-film-open" aria-hidden="true"></div><div class="gift-film-speaker" aria-hidden="true"><img src="assets/speaker-transparent.png" alt=""></div><div class="gift-film-card" aria-hidden="true">${cardMarkup}</div><div class="gift-film-closed" aria-hidden="true"></div></div><div class="gift-finish-copy" aria-live="polite"><h1>Wrapped with care.</h1><p>A little something for someone who matters.</p></div></div><footer class="gift-finish-actions" hidden><button class="primary" data-action="gift-view-orders">View in My Orders</button><button class="secondary-button" data-action="gift-create-new">Back to Create</button></footer></div>`;
}
export function mountGiftPreview(root,{completed=false,onComplete=()=>{}}={}){
 const q=s=>root.querySelector(s),stage=q('.gift-film-stage'),match=matchMedia('(prefers-reduced-motion: reduce)');
 let finished=false,destroyed=false,elapsed=0,lastTime=null,raf=0;
 const animations=[],duration=8000;
 function finish(){if(destroyed||finished)return;finished=true;cancelAnimationFrame(raf);animations.forEach(a=>a.cancel());root.classList.add('gift-film-complete');q('.gift-finish-actions').hidden=false;q('.gift-finish-copy h1').textContent='Your gift is ready.';q('.gift-finish-copy p').textContent='Made with care, ready to keep.';stage.setAttribute('aria-label','A finished gift box with a sage ribbon');if(!completed)onComplete();}
 function animate(el,frames,options){if(el?.animate)animations.push(el.animate(frames,{fill:'both',easing:'cubic-bezier(.22,.68,0,1)',...options}));}
 function tick(now){if(destroyed||finished||document.hidden)return;if(lastTime!==null)elapsed+=now-lastTime;lastTime=now;if(elapsed>=duration){finish();return}raf=requestAnimationFrame(tick);}
 function visibility(){lastTime=null;cancelAnimationFrame(raf);if(finished||destroyed)return;animations.forEach(a=>document.hidden?a.pause():a.play());if(!document.hidden)raf=requestAnimationFrame(tick);}
 const reduced=()=>{if(match.matches)finish()};
 document.addEventListener('visibilitychange',visibility);match.addEventListener('change',reduced);
 if(completed||match.matches)finish();else{
  animate(q('.gift-film-open'),[{opacity:0,transform:'translateY(20px) scale(.94)'},{opacity:1,transform:'translateY(0) scale(1)',offset:.2},{opacity:1,offset:.75},{opacity:0,transform:'scale(.98)'}],{duration:5400});
  animate(q('.gift-film-card'),[{opacity:0,transform:'translateY(-50px) scale(.8) rotate(-8deg)'},{opacity:1,offset:.18},{opacity:1,transform:'translateY(12px) scale(.72) rotate(-5deg)',offset:.5},{opacity:0,transform:'translateY(100px) scale(.36) rotate(0deg)'}],{duration:3700,delay:700});
  if(root.dataset.physical==='true')animate(q('.gift-film-speaker'),[{opacity:0,transform:'translateY(-20px) scale(.65)'},{opacity:1,offset:.2},{opacity:1,transform:'translateY(18px) scale(.62)',offset:.55},{opacity:0,transform:'translateY(95px) scale(.38)'}],{duration:3500,delay:600});
  animate(q('.gift-film-closed'),[{opacity:0,transform:'translateY(10px) scale(.94)'},{opacity:1,transform:'translateY(0) scale(1)',offset:.45},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:4000,delay:4000});
  if(document.hidden)animations.forEach(a=>a.pause());else raf=requestAnimationFrame(tick);
 }
 return {audioChanged(){},destroy(){destroyed=true;cancelAnimationFrame(raf);animations.forEach(a=>a.cancel());document.removeEventListener('visibilitychange',visibility);match.removeEventListener('change',reduced)},state(){return {finished,playing:!finished&&!destroyed,elapsed}}};
}
