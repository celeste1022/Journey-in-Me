import {ConnectionFlow, scenarios, networks, errorCopy} from './flow.mjs';
const flow=new ConnectionFlow();
const $=(s)=>document.querySelector(s);
const app=$('#app');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={back:'<path d="m14 5-7 7 7 7"/>',check:'<path d="m5 12 4 4L19 6"/>',wifi:'<path d="M2 8a15 15 0 0 1 20 0M5 11a10 10 0 0 1 14 0m-10 4a5 5 0 0 1 6 0"/><circle cx="12" cy="19" r=".8"/>',chevron:'<path d="m7 10 5 5 5-5"/>',eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',eyeOff:'<path d="m3 3 18 18M10 5c7-1 12 7 12 7a20 20 0 0 1-4 4M6 6a19 19 0 0 0-4 6s3.5 7 10 7c1 0 3-.3 4-1M9 9a4 4 0 0 0 6 6"/>',lock:'<rect x="6" y="10" width="12" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',refresh:'<path d="M20 7v5h-5M4 17v-5h5M5 8a8 8 0 0 1 14-1l1 5M4 12l1 5a8 8 0 0 0 14-1"/>',alert:'<path d="M12 8v5"/><circle cx="12" cy="17" r=".6"/><path d="m10 3-9 16a2 2 0 0 0 2 3h18a2 2 0 0 0 2-3L14 3a2 2 0 0 0-4 0Z"/>',home:'<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',bluetooth:'<path d="m7 7 10 10-5 4V3l5 4L7 17"/>',power:'<path d="M12 2v10M7 5a9 9 0 1 0 10 0"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>'};
const icon=(name,cls='')=>`<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.check}</svg>`;
const button=(text,action,cls='primary',disabled=false)=>`<button class="${cls}" data-action="${action}" ${disabled?'disabled':''}>${text}</button>`;
const speaker=(cls='')=>`<div class="speaker-art ${cls}"><img src="assets/speaker-line.png" alt="Bell-shaped meditation speaker, without a card" draggable="false"></div>`;
const spinner=()=>'<span class="spinner" aria-hidden="true"></span>';
const nav=(allowBack=true,step=0)=>`<nav class="app-nav">${allowBack?`<button class="icon-button" data-action="back" aria-label="Back">${icon('back')}</button>`:'<span class="nav-spacer"></span>'}<span class="step-dots" aria-label="Step ${step+1} of 3">${[0,1,2].map(n=>`<i class="${n<=step?'active':''}"></i>`).join('')}</span><span class="nav-spacer"></span></nav>`;
const frame=(content,footer='',opts={})=>`<div class="app-view ${opts.cls||''}">${nav(opts.back!==false,opts.step||0)}<div class="app-content">${content}</div>${footer?`<footer class="app-footer">${footer}</footer>`:''}</div>`;
const closePhone=()=>'<p class="proximity">Keep your phone close to the speaker.</p>';
const notice=text=>`<div class="notice">${icon('alert')}<p>${text}</p></div>`;
const headings={start:['P01 · 开始绑定','Start Binding',0],scan:['P02 · 扫描中','Scanning',0],'not-found':['P02-A · 未找到设备','No Device Found',0],wifi:['P03 · Wi-Fi 设置','Connect Device',1],connecting:['P04 · 正在连接','Connecting',1],connected:['P05 · 连接成功','Pairing Done',1],checking:['P05-A · 检查固件','Checking for Updates',2],downloading:['P06 · 下载固件','Updating Firmware',2],installing:['P07 · 安装与重启','Installing Update',2],complete:['P08 · 更新完成','Update Complete',2],'update-error':['固件更新异常','Update interrupted',2],recovery:['恢复连接与读取设备状态','Reconnecting',2],home:['P00 · Home','Home',2]};
function wifiScreen(){
  const options=flow.wifiStatus==='loading'?`<div class="network-empty">${spinner()}<p>Scanning for networks…</p></div>`:flow.wifiStatus==='empty'?`<div class="network-empty">${icon('wifi')}<p>No networks found</p><small>Check your router, then rescan.</small></div>`:networks.map(n=>`<li><button data-network="${n}" role="option" aria-selected="${n===flow.ssid}">${icon('wifi')}<span>${n}</span>${n===flow.ssid?icon('check'):icon('lock','lock-icon')}</button></li>`).join('');
  return frame(`<h1>Connect Device</h1><p class="center-copy compact-copy">Device found,<br>ready for Wi-Fi setup.</p>${speaker('small')}<div class="wifi-form"><label id="network-label">Wi-Fi Network</label><button class="network-select ${flow.wifiOpen?'expanded':''}" id="network-trigger" data-action="networks" aria-expanded="${flow.wifiOpen}" aria-controls="wifi-options" aria-labelledby="network-label network-value"><span id="network-value">${flow.ssid?esc(flow.ssid):'Select your Wi-Fi'}</span>${icon('chevron')}</button>${flow.wifiOpen?`<section class="network-panel" id="wifi-options" aria-label="Nearby Wi-Fi networks"><div class="network-header"><span>2.4 GHz only</span><button class="rescan" data-action="rescan" ${flow.wifiStatus==='loading'?'disabled':''}>${icon('refresh')}Rescan</button></div>${flow.wifiStatus==='ready'?`<ul class="network-list" role="listbox" aria-label="Available networks">${options}</ul>`:options}</section>`:''}<label for="wifi-password" class="password-label">Password</label><div class="password-field"><input id="wifi-password" type="${flow.showPassword?'text':'password'}" placeholder="Enter Wi-Fi password" value="${esc(flow.password)}" autocomplete="off" spellcheck="false" autocapitalize="off" aria-label="Wi-Fi password"><button class="icon-button" data-action="password" aria-label="${flow.showPassword?'Hide':'Show'} password">${icon(flow.showPassword?'eyeOff':'eye')}</button></div></div>`,closePhone()+button('Next','connect','primary',!flow.canConnect),{step:1,cls:flow.wifiOpen?'wifi-expanded':'wifi-screen'});
}
function view(){
  switch(flow.screen){
    case 'start':return frame(`<div class="page-kicker">YOUR SPEAKER, CONNECTED</div><h1>Start Binding</h1><div class="intro-art">${speaker()}</div><p class="center-copy">Turn on the connection button.<br>Once you hear <span class="quoted">“Ready for pairing”</span>,<br>you’re ready to connect.</p>`,button('I heard the pairing prompt','confirm')+'<p class="footer-caption">Make sure your speaker is powered on.</p>',{cls:'start-screen'});
    case 'scan':return frame(`<h1>Scanning</h1><div class="scan-art">${speaker()}<div class="scan-progress"><span class="soft-pulse"></span>${icon('bluetooth')}</div></div><div class="center-copy"><h2>Finding your speaker</h2><p>Scanning nearby devices</p><span class="countdown" id="countdown">${flow.remaining}s remaining</span></div>${flow.pairingHint?notice('Make sure your speaker is in pairing mode. Listen for “Ready for pairing”.'):''}`,closePhone());
    case 'not-found':return frame(`<h1>No Device Found</h1><div class="empty-state">${speaker('muted-art')}<h2>Let’s try that again.</h2><p>Make sure your speaker is powered on<br>and ready for pairing.</p></div>`,closePhone()+button('Retry','retry-scan'));
    case 'wifi':return wifiScreen();
    case 'connecting':return frame(`<h1>Connecting</h1><div class="connection-visual">${speaker()}<span class="state-seal">${spinner()}</span></div><p class="center-copy">Connecting your speaker to<br><strong>${esc(flow.ssid)}</strong></p><p class="center-sub">This may take a moment.</p>`,closePhone(),{back:false,step:1});
    case 'connected':return frame(`<div class="page-kicker">A LITTLE CLOSER</div><h1>Pairing Done.</h1><div class="connection-visual">${speaker()}<span class="state-seal success">${icon('check')}</span></div><p class="center-copy">Your speaker is connected<br>to your home Wi-Fi.</p><div class="connection-label"><span class="status-dot"></span>${esc(flow.ssid)}</div>`,button('Get Started','check')+'<p class="footer-caption">Your device is online now.</p>',{back:false,step:1});
    case 'checking':return frame(`<h1>Checking<br>for Updates</h1><div class="connection-visual">${speaker()}<span class="state-seal">${spinner()}</span></div><p class="center-copy">A quick check before<br>your first moment of calm.</p>`,closePhone(),{back:false,step:2});
    case 'downloading':return frame(`<h1>Updating Firmware</h1><p class="screen-subtitle">A little update. A smoother experience.</p>${speaker('update-art')}<div class="download-status"><span>Downloading firmware</span><strong>${flow.progress}%</strong></div><div class="progress-track" role="progressbar" aria-label="Downloading firmware" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${flow.progress}"><i style="width:${flow.progress}%"></i></div><p class="center-sub">Keep your speaker connected to Wi-Fi.</p>`,notice('Do not power off the device during the update.'),{back:false,step:2});
    case 'installing':return frame(`<h1>Installing Update</h1><div class="connection-visual">${speaker()}<span class="state-seal">${spinner()}</span></div><p class="center-copy">${flow.elapsed>=2200?'Your speaker is restarting.':'Finishing things up.'}</p><p class="center-sub">Device will restart automatically.</p>`,notice('Do not power off the device during the update.'),{back:false,step:2});
    case 'complete':return frame(`<div class="page-kicker">READY WHEN YOU ARE</div><h1>Update Complete</h1><div class="connection-visual">${speaker()}<span class="state-seal success">${icon('check')}</span></div><p class="center-copy">Your speaker is running<br>the latest version.</p><p class="center-sub">A moment to reconnect awaits.</p>`,button('Done','done'),{back:false,step:2});
    case 'update-error':{
      const [title,copy]=errorCopy[flow.error];
      return frame(`<div class="error-mark">${icon(flow.error==='power'?'power':'alert')}</div><h1 class="error-title">${title}</h1><p class="center-copy error-copy">${copy}</p>${speaker('error-art')}<p class="center-sub">${flow.error==='power'?'We’ll read your speaker’s status before continuing.':'You can retry now or continue later from Home.'}</p>`,button('Retry','retry-update')+button('Later','later','text-button'),{back:false,step:2,cls:'error-screen'});
    }
    case 'recovery':return frame(`<h1>Reconnecting</h1><div class="connection-visual">${speaker()}<span class="state-seal">${spinner()}</span></div><p class="center-copy">Checking your speaker’s status<br>before continuing.</p>`,closePhone(),{back:false,step:2});
    case 'home':return `<div class="app-view home-screen"><div class="app-content"><div class="home-brand">Journey in Me<span>.</span></div><div class="home-intro"><p class="page-kicker">WELCOME HOME</p><h1>A little space<br>for yourself.</h1><p>Come back to your own rhythm.</p></div><section class="speaker-card">${speaker('home-art')}<div class="speaker-card-heading"><h2>My speaker</h2><span class="connection-pill ${flow.online?'is-online':''}"><i></i>${flow.online?'Connected':'Not connected'}</span></div><p>${flow.online?esc(flow.ssid):'Your quiet companion, waiting to connect.'}</p>${flow.pending?`<div class="pending-row">${icon('download')}<span>Update pending</span></div>`:''}${!flow.online&&!flow.pending?button('Connect device','restart-from-home','secondary'):flow.pending?button(flow.online?'Resume Update':'Reconnect','resume','secondary'):'<div class="ready-note">'+icon('check')+'Your speaker is ready.</div>'}</section><p class="home-quote">“A moment to reconnect.”</p></div><div class="home-tab">${icon('home')}<span>Home</span></div></div>`;
    default:throw new Error('Missing screen');
  }
}
function failureDialog(){return `<div class="modal-backdrop"><section class="connection-dialog" role="dialog" aria-modal="true" aria-labelledby="failure-title" aria-describedby="failure-copy" tabindex="-1"><span class="dialog-symbol">${icon('alert')}</span><h2 id="failure-title">Connection Failed</h2><p id="failure-copy">Please check the following before retrying:</p><ul><li>Confirm your Wi-Fi works properly.</li><li>Move the speaker closer to your router.</li><li>Double-check your Wi-Fi password.</li></ul>${button('Retry','retry-connection')}${button('Cancel','cancel-connection','text-button')}</section></div>`;}
let lastScreen='',lastDialog=false;
function render(){
  const active=document.activeElement;
  const activeId=app.contains(active)?active.id:null;
  const selection=activeId==='wifi-password'?[active.selectionStart,active.selectionEnd]:null;
  app.innerHTML=view();
  if(flow.connectionError){app.firstElementChild.inert=true;app.insertAdjacentHTML('beforeend',failureDialog());}
  const entry=headings[flow.screen];
  let label=entry[0];
  if(flow.pairingHint)label='P02-B · 扫描中的配对提示';
  if(flow.screen==='wifi'&&flow.wifiOpen)label=flow.wifiStatus==='empty'?'P03-B · 未发现 Wi-Fi':'P03-A · 页内展开 Wi-Fi';
  if(flow.connectionError)label='P04-A · 连接失败';
  if(flow.screen==='update-error')label={check:'P05-B · 固件检查失败',network:'P06-A · Wi-Fi 不稳定',corrupted:'P06-B · 固件校验失败',power:'P07-A · 设备失联'}[flow.error];
  if(flow.screen==='home')label=flow.pending?(flow.online?'P00-B · 已连接，待更新':'P00-C · 未连接，待更新'):(flow.online?'P00-A · 已连接':'P00 · 未连接');
  $('#screen-label').textContent=label;
  document.querySelectorAll('[data-step]').forEach(e=>{e.classList.toggle('current',+e.dataset.step===entry[2]);e.classList.toggle('complete',+e.dataset.step<entry[2]);});
  $('#skip-wait').disabled=!flow.waiting;
  if(lastScreen!==flow.screen){$('#announcement').textContent=entry[1]; const title=app.querySelector('h1');if(title){title.tabIndex=-1;title.focus({preventScroll:true});}}
  else if(activeId){const target=document.getElementById(activeId);target?.focus({preventScroll:true});if(selection&&target)target.setSelectionRange(...selection);}
  if(flow.connectionError&&!lastDialog)app.querySelector('[data-action="retry-connection"]').focus();
  if(!flow.connectionError&&lastDialog)app.querySelector('#wifi-password')?.focus();
  lastScreen=flow.screen;lastDialog=flow.connectionError;
}
const actions={back:()=>flow.back(),confirm:()=>flow.confirmPrompt(),'retry-scan':()=>flow.retryScan(),networks:()=>flow.openNetworks(),rescan:()=>flow.rescanNetworks(),password:()=>{flow.showPassword=!flow.showPassword;},connect:()=>flow.connect(),check:()=>flow.checkUpdates(),done:()=>flow.done(),'retry-update':()=>flow.retryUpdate(),later:()=>flow.later(),resume:()=>flow.resume(),'restart-from-home':()=>flow.restartFromHome(),'retry-connection':()=>flow.connect(),'cancel-connection':()=>flow.cancelConnectionError()};
app.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;if(b.dataset.network){flow.selectNetwork(b.dataset.network);render();$('#wifi-password')?.focus();}else if(actions[b.dataset.action]){actions[b.dataset.action]();render();}});
app.addEventListener('input',e=>{if(e.target.id==='wifi-password'){flow.password=e.target.value;app.querySelector('[data-action="connect"]').disabled=!flow.canConnect;}});
app.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&e.target.id==='wifi-password'&&flow.canConnect){flow.connect();render();}
  if(flow.connectionError){
    if(e.key==='Escape'){e.preventDefault();flow.cancelConnectionError();render();}
    if(e.key==='Tab'){const focusable=[...app.querySelectorAll('.connection-dialog button')];const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  }
});
$('#scenario').innerHTML=scenarios.map(([id,title])=>`<option value="${id}">${title}</option>`).join('');
function describeScenario(){const selected=$('#scenario').value;$('#scenario-description').textContent=scenarios.find(([id])=>id===selected)[2];$('.recovery-label').hidden=selected!=='power-cut';}
$('#scenario').addEventListener('change',describeScenario);
$('#run-scenario').addEventListener('click',()=>{flow.startScenario($('#scenario').value);flow.recoveryResult=$('#recovery-outcome').value;render();});
$('#reset-demo').addEventListener('click',()=>{flow.reset($('#scenario').value);flow.recoveryResult=$('#recovery-outcome').value;render();});
$('#recovery-outcome').addEventListener('change',e=>flow.recoveryResult=e.target.value);
$('#skip-wait').addEventListener('click',()=>{flow.tick(30000);render();});
let previous=performance.now();setInterval(()=>{const now=performance.now();const elapsed=now-previous;previous=now;if(flow.tick(elapsed*Number($('#speed').value)))render();},250);
if(matchMedia('(max-width: 760px)').matches)$('.demo-controls').open=false;
describeScenario();render();
