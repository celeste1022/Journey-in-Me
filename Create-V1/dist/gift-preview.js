import {reduceMotion} from './motion.js';
const EASE='cubic-bezier(.22,.68,0,1)';
const STAGES=[
 {id:'parcel',title:'A little something, on its way.',detail:'Made for someone who matters.',duration:2400},
 {id:'arrival',title:'The first little surprise.',detail:'A gift, waiting inside.',duration:2800},
 {id:'unwrap',title:'Wrapped with a little care.',detail:'Something to keep close.',duration:2800},
 {id:'reveal',title:'And here is your moment.',detail:'An image. A few words. Your voice.',duration:3000},
 {id:'card',title:'A card made just for you.',detail:'A small place to return to.',duration:2800},
 {id:'insert',title:'Give your card a voice.',detail:'Let your moment find its sound.',duration:3400},
 {id:'listen',title:'A familiar voice, close by.',detail:'Your sound, coming to life.',duration:3000},
 {id:'bedside',title:'A little company, every day.',detail:'A place beside you, whenever you need it.',duration:4200}
];
export function giftPreviewMarkup({gift,cardMarkup,icon,esc}){
 const physical=gift.kind==='set';
 return `<div class="view gift-cinema" data-physical="${physical}"><header class="cinema-top"><button class="icon-button" data-action="gift-preview-back" aria-label="Back to gift summary">${icon('chevron-left')}</button><span>A gift for ${esc(gift.recipient||'you')}</span><button class="icon-button" data-action="gift-sound" aria-label="Mute gift sound" aria-pressed="false">${icon('volume-2')}</button></header><div class="cinema-scroll"><div class="cinema-scene" role="img" aria-label="Your gift, ready to open" tabindex="0"><div class="cinema-layer packing packing-0"></div><div class="cinema-layer packing packing-1"></div><div class="cinema-layer packing packing-2"></div><div class="cinema-layer packing packing-3"></div><img class="cinema-layer bedside" src="assets/gift-bedside.png" alt=""><div class="cinema-card">${cardMarkup}</div><div class="cinema-speaker speaker-art"><div class="speaker-crop"><img src="assets/speaker-transparent.png" alt=""></div></div><div class="cinema-insert-card">${cardMarkup}</div><div class="cinema-speaker-front speaker-art" aria-hidden="true"><div class="speaker-crop"><img src="assets/speaker-transparent.png" alt=""></div></div><div class="cinema-sound-mark" aria-hidden="true">${[12,22,16,30,19,26,14].map((n,i)=>`<span style="--h:${n}px;--i:${i}"></span>`).join('')}</div></div><div class="cinema-copy" aria-live="polite" aria-atomic="true"><p class="cinema-counter">${physical?'01 / 08':'01 / 04'}</p><h1 tabindex="-1">${physical?STAGES[0].title:'A little something, just for you.'}</h1><p class="cinema-caption">${physical?STAGES[0].detail:'Your moments, gathered with care.'}</p></div></div><footer class="cinema-footer"><div class="cinema-progress" role="progressbar" aria-label="Gift preview progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div><div class="cinema-playback"><button class="icon-button" data-action="gift-replay" aria-label="Replay gift preview">${icon('rotate-ccw')}</button><button class="primary" data-action="gift-toggle">Open gift</button><button class="icon-button" data-action="gift-next" aria-label="Next scene">${icon('skip-forward')}</button></div><div class="cinema-secondary"><button class="text-button" data-action="gift-skip">Skip to the end</button><button class="text-button" data-action="gift-motion" aria-pressed="${reduceMotion()}">${reduceMotion()?'Reduced motion':'Reduce motion'}</button></div><p class="cinema-audio-note" aria-live="polite"></p></footer></div>`;
}
export function mountGiftPreview(root,{icon,icons,audio,prime}){
 const scene=root.querySelector('.cinema-scene');
 const physical=root.dataset.physical==='true';
 const stages=physical?STAGES:STAGES.filter(s=>['unwrap','reveal','card','listen'].includes(s.id));
 let starts=[],total=0;for(const s of stages){starts.push(total);total+=s.duration}
 let elapsed=0,playing=false,started=false,finished=false,muted=false,reduced=reduceMotion(),raf=0,anchor=0,lastIndex=-1,lastSound=false,destroyed=false,audioBlocked=false,manualSound=false,startRequest=0;
 let animations=[];
 const match=matchMedia('(prefers-reduced-motion: reduce)');
 const q=s=>root.querySelector(s);
 const progress=q('.cinema-progress');progress.innerHTML=stages.map((s,i)=>`<span class="cinema-progress-segment" aria-hidden="true"><i></i></span>`).join('');
 function animateTo(el,pose,ms=850){
  if(!el)return;
  const previous={opacity:getComputedStyle(el).opacity,transform:getComputedStyle(el).transform};
  el.getAnimations().forEach(a=>a.cancel());Object.assign(el.style,pose);
  if(!reduced&&started){const a=el.animate([previous,pose],{duration:ms,easing:EASE});animations.push(a)}
 }
 function setVisible(sel,opacity,transform='none',duration=850){animateTo(q(sel),{opacity:String(opacity),transform},duration)}
 function pose(index){
  const stage=stages[index],id=stage.id;
  scene.dataset.stage=id;
  const packing=['parcel','arrival','unwrap','reveal'].indexOf(id);
  for(let n=0;n<4;n++)setVisible('.packing-'+n,n===packing?1:0,n===packing?'translateY(0) scale(1)':'translateY(-8px) scale(.96)',900);
  setVisible('.bedside',id==='bedside'?1:0,id==='bedside'?'scale(1)':'scale(1.04)',1400);
  const cardVisible=['reveal','card'].includes(id);
  setVisible('.cinema-card',cardVisible?1:0,id==='reveal'?'translateY(-16%) scale(.55) rotate(-7deg)':id==='card'?'translateY(0) scale(1) rotate(0deg)':'translateY(24%) scale(.85)',id==='card'?1150:1000);
  const speakerVisible=['insert','listen','bedside'].includes(id)&&physical;
  const speakerHeight=q('.cinema-speaker').offsetHeight;
  const photoHeight=Math.max(scene.clientHeight,scene.clientWidth*1.5);
  const tabletop=.65*photoHeight-(photoHeight-scene.clientHeight)/2;
  const bedsideX=scene.clientWidth*.1,bedsideY=tabletop-scene.clientHeight*.2-speakerHeight*.82;
  const speakerPose=id==='bedside'?`translate(${bedsideX}px,${bedsideY}px) scale(.64)`:'translate(0,0) scale(1)';
  setVisible('.cinema-speaker',speakerVisible?1:0,speakerPose,id==='bedside'?1800:950);
  setVisible('.cinema-speaker-front',id==='insert'?1:0,speakerPose,850);
  setVisible('.cinema-insert-card',id==='insert'?1:0,'translateY(-18%) scale(.95) rotate(-5deg)',450);
  if(id==='insert'&&!reduced&&started){const el=q('.cinema-insert-card');const a=el.animate([{transform:'translateY(-18%) scale(.95) rotate(-5deg)',opacity:1,offset:0},{transform:'translateY(17%) scale(.82) rotate(-2deg)',opacity:1,offset:.4},{transform:'translateY(102%) scale(.66) rotateX(42deg)',opacity:0,offset:1}],{duration:2600,delay:500,fill:'forwards',easing:'cubic-bezier(.4,0,.2,1)'});animations.push(a)}
  if(id==='insert'&&reduced){q('.cinema-insert-card').style.transform='translateY(25%) scale(.75)';}
  if(!physical&&id==='listen')setVisible('.cinema-card',1,'translateY(0) scale(.9)');
  setVisible('.cinema-sound-mark',['listen','bedside'].includes(id)?1:0);
  q('.cinema-counter').textContent=String(index+1).padStart(2,'0')+' / '+String(stages.length).padStart(2,'0');
  q('.cinema-copy h1').textContent=stage.title;
  q('.cinema-caption').textContent=stage.detail;
  scene.setAttribute('aria-label',stage.title+' '+stage.detail);
  if(!reduced&&started)q('.cinema-copy').animate([{opacity:.2,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:EASE});
  progress.querySelectorAll('.cinema-progress-segment').forEach((b,i)=>{b.setAttribute('aria-current',i===index?'step':'false');b.classList.toggle('complete',i<index)});
 }
 async function syncSound(index){
  const soundScene=['listen','bedside'].includes(stages[index].id);
  const wanted=(playing||manualSound)&&!muted&&soundScene;
  root.classList.toggle('sound-playing',wanted&&!audioBlocked);
  if(wanted&&!lastSound){lastSound=true;try{await audio.play();audioBlocked=false;if(reduced||finished)q('.cinema-audio-note').innerHTML='<button class="text-button" data-action="gift-enable-audio">Pause sound</button>';else q('.cinema-audio-note').textContent=''}catch{audioBlocked=true;lastSound=false;root.classList.remove('sound-playing');q('.cinema-audio-note').innerHTML='<button class="text-button" data-action="gift-enable-audio">Tap to hear your sound</button>'}}
  if(!wanted&&lastSound){audio.pause();lastSound=false}
  if(soundScene&&(reduced||finished||audioBlocked)){q('.cinema-audio-note').innerHTML=`<button class="text-button" data-action="gift-enable-audio">${wanted&&!audioBlocked?'Pause sound':'Play your sound'}</button>`}else if(!audioBlocked){q('.cinema-audio-note').textContent=''}
 }
 function update(){
  const index=Math.min(stages.length-1,starts.findLastIndex(t=>elapsed>=t));
  if(index!==lastIndex){lastIndex=index;pose(index)}
  progress.querySelectorAll('.cinema-progress-segment i').forEach((el,i)=>el.style.transform=`scaleX(${i<index?1:i>index?0:Math.min(1,(elapsed-starts[i])/stages[i].duration)})`);
  syncSound(index);
  progress.setAttribute('aria-valuenow',String(Math.round(elapsed/total*100)));
  progress.setAttribute('aria-valuetext',`Scene ${index+1} of ${stages.length}: ${stages[index].title}`);
  q('[data-action=gift-toggle]').innerHTML=finished?'Replay gift':!started?'Open gift':playing?`${icon('pause')}<span>Pause</span>`:`${icon('play')}<span>${reduced?'Next scene':'Continue'}</span>`;
  q('[data-action=gift-toggle]').setAttribute('aria-label',finished?'Replay gift':!started?'Open gift':playing?'Pause gift preview':reduced?'Next scene':'Continue gift preview');
  q('[data-action=gift-sound]').innerHTML=icon(muted?'volume-x':'volume-2');q('[data-action=gift-sound]').setAttribute('aria-label',muted?'Enable gift sound':'Mute gift sound');q('[data-action=gift-sound]').setAttribute('aria-pressed',String(muted));
  q('[data-action=gift-motion]').textContent=reduced?'Reduced motion':'Reduce motion';q('[data-action=gift-motion]').setAttribute('aria-pressed',String(reduced));
  q('[data-action=gift-next]').disabled=finished;
  root.classList.toggle('is-paused',!playing);root.classList.toggle('reduced-motion',reduced);
  icons();
 }
 function tick(now){if(!playing||destroyed)return;elapsed=Math.min(total,now-anchor);updateProgressOnly();if(elapsed>=total){finished=true;playing=false;audio.pause();lastSound=false;update();return}raf=requestAnimationFrame(tick)}
 function updateProgressOnly(){const index=Math.min(stages.length-1,starts.findLastIndex(t=>elapsed>=t));if(index!==lastIndex){update();return}const el=progress.querySelectorAll('.cinema-progress-segment i')[index];if(el)el.style.transform=`scaleX(${Math.min(1,(elapsed-starts[index])/stages[index].duration)})`}
 async function start(){if(destroyed)return;const request=++startRequest;started=true;finished=false;manualSound=false;if(elapsed>=total)elapsed=0;playing=!reduced;update();try{await prime()}catch{}if(destroyed||request!==startRequest)return;if(reduced){playing=false;lastIndex=-1;update();return}playing=true;anchor=performance.now()-elapsed;animations.forEach(a=>{if(a.playState==='paused')a.play()});update();cancelAnimationFrame(raf);raf=requestAnimationFrame(tick)}
 function pause(){startRequest++;manualSound=false;playing=false;cancelAnimationFrame(raf);animations.forEach(a=>{if(a.playState==='running')a.pause()});audio.pause();lastSound=false;update()}
 function seek(index){manualSound=false;audio.pause();lastSound=false;cancelAnimationFrame(raf);animations.forEach(a=>a.cancel());animations=[];elapsed=starts[Math.max(0,Math.min(stages.length-1,index))];started=true;finished=false;lastIndex=-1;anchor=performance.now()-elapsed;update();if(playing)raf=requestAnimationFrame(tick)}
 function next(){if(lastIndex>=stages.length-1){elapsed=total;finished=true;pause();return}seek(lastIndex+1)}
 function toggleMotion(){reduced=!reduced;pause();lastIndex=-1;update()}
 const visibility=()=>{if(document.hidden&&playing)pause()};document.addEventListener('visibilitychange',visibility);
 const systemChange=()=>{reduced=match.matches;pause();lastIndex=-1;update()};match.addEventListener('change',systemChange);
 const keyboard=e=>{if(e.key==='ArrowRight'){e.preventDefault();next()}else if(e.key==='ArrowLeft'){e.preventDefault();seek(lastIndex-1)}else if(e.key===' '){e.preventDefault();playing?pause():start()}};scene.addEventListener('keydown',keyboard);
 update();
 return {start,pause,next,audioChanged(isPlaying){root.classList.toggle('sound-playing',isPlaying);if(!isPlaying&&manualSound&&!playing){manualSound=false;lastSound=false;const control=q('[data-action=gift-enable-audio]');if(control)control.textContent='Play your sound'}},replay(){pause();elapsed=0;lastIndex=-1;started=false;finished=false;update();start()},toggle(){if(finished){this.replay()}else if(reduced&&started){next()}else playing?pause():start()},seek,skip(){startRequest++;manualSound=false;playing=false;seek(stages.length-1);elapsed=total;finished=true;audio.pause();lastSound=false;update()},toggleSound(){muted=!muted;audioBlocked=false;update()},enableAudio(){manualSound=!lastSound;muted=false;audioBlocked=false;update()},toggleMotion,destroy(){startRequest++;destroyed=true;cancelAnimationFrame(raf);animations.forEach(a=>a.cancel());audio.pause();document.removeEventListener('visibilitychange',visibility);match.removeEventListener('change',systemChange);scene.removeEventListener('keydown',keyboard)},state(){return {stage:stages[lastIndex]?.id,playing,finished,reduced,muted}}};
}
