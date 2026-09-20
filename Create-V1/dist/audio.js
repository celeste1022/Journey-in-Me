const file='assets/mist-ambient.m4a';
export class SoundPlayer{
 constructor(onUpdate){this.background=new Audio(file);this.voice=new Audio();this.onUpdate=onUpdate;this.background.preload='metadata';this.voice.preload='metadata';this.mode='background';this.limit=null;this.background.volume=.35;this.voice.volume=.75;for(const a of [this.background,this.voice]){a.addEventListener('timeupdate',()=>{if(a===this.main&&this.limit&&a.currentTime>=this.limit){this.pause();this.seek(0);}this.onUpdate?.(this)});a.addEventListener('ended',()=>{if(a===this.main)this.pause();this.onUpdate?.(this)});a.addEventListener('error',()=>this.onUpdate?.(this));}this.source='demo';}
 get main(){return this.mode!=='background'&&this.voice.src?this.voice:this.background}
 get playing(){return !this.main.paused}
 get current(){return this.main.currentTime||0}
 get duration(){return this.limit||((Number.isFinite(this.main.duration)&&this.main.duration>0)?this.main.duration:720)}
 configure({voice,background=true,limit=null,voiceVolume=75,soundVolume=35}={}){this.stop();this.primed=false;this.limit=limit;this.mode=voice&&voice!=='demo'?(background?'mixed':'voice'):'background';if(voice&&voice!=='demo'&&this.source!==voice){this.voice.src=voice;this.source=voice;}this.background.volume=soundVolume/100;this.voice.volume=voiceVolume/100;}
 async prime(){if(this.primed)return;const tracks=this.mode==='mixed'?[this.background,this.voice]:[this.main];const volumes=tracks.map(a=>a.volume);try{tracks.forEach(a=>a.volume=0);await Promise.all(tracks.map(a=>a.play()));this.primed=true;}finally{tracks.forEach((a,i)=>{a.pause();a.currentTime=0;a.volume=volumes[i]});}}
 async toggle(){if(this.current>=this.duration-.1)this.seek(0);if(this.playing){this.pause();return;}if(this.main.ended)this.seek(0);if(this.mode==='mixed'){await Promise.all([this.background.play(),this.voice.play()]);}else await this.main.play();this.onUpdate?.(this)}
 pause(){this.background.pause();this.voice.pause();this.onUpdate?.(this)}
 stop(){this.pause();this.background.currentTime=0;try{this.voice.currentTime=0}catch{}}
 seek(value){for(const a of this.mode==='mixed'?[this.background,this.voice]:[this.main])if(Number.isFinite(a.duration))a.currentTime=Math.max(0,Math.min(value,a.duration));this.onUpdate?.(this)}
 volume(kind,n){(kind==='voice'?this.voice:this.background).volume=n/100}
}
