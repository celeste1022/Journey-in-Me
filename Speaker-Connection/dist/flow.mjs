export const scenarios = [
  ['success', '完整成功路径', '从首次登录后的绑定开始，完成配网和固件更新。'],
  ['delayed', '稍晚发现设备', '第 10 秒出现配对提示，第 12 秒发现音箱。'],
  ['scan-timeout', '30 秒未找到设备', '扫描超时后重试；第二次可找到音箱。'],
  ['wifi-empty', '没有找到 Wi-Fi', '页内显示空列表，再次 Rescan 后恢复。'],
  ['wifi-failed', 'Wi-Fi 连接失败', '第一次连接失败。Retry 重新连接，Cancel 保留输入。'],
  ['no-update', '固件已是最新版', '连接完成后检查固件，直接回到 Home。'],
  ['check-failed', '固件检查失败', '可重新检查，或稍后从 Home 继续。'],
  ['wifi-unstable', '下载时网络不稳定', '可重试下载，或稍后恢复更新。'],
  ['corrupted', '固件校验失败', '重新下载并校验，也可以稍后处理。'],
  ['power-cut', '安装时设备失联', '重新连接并读取设备状态，再决定如何继续。'],
];
export const networks = ['Home_2.4G', 'Studio_WiFi', 'Meditation_Room', 'Guest_2.4G', 'Garden_2.4G'];
export const errorCopy = {
  check: ['Couldn’t check for updates', 'We couldn’t check your speaker’s firmware. Please try again.'],
  network: ['Update interrupted', 'Wi-Fi connection unstable. Please retry.'],
  corrupted: ['Download couldn’t be verified', 'The firmware download is corrupted. Download it again to continue.'],
  power: ['Speaker disconnected', 'Device power interrupted or connection lost. Restore power, then try again.'],
};
export class ConnectionFlow {
  constructor(scenario='success') { this.reset(scenario); }
  reset(scenario=this.scenario) {
    if (!scenarios.some(([key])=>key===scenario)) throw new Error('Unknown scenario');
    Object.assign(this, {scenario, screen:'start', elapsed:0, ssid:'', password:'', showPassword:false,
      wifiOpen:false, wifiStatus:'ready', wifiElapsed:0, connectionError:false,
      online:false, pending:false, installed:false, devicePhase:'checking', error:null,
      progress:0, recoveryResult:'installed', used:{}, history:['P01 · 开始绑定']});
  }
  get canConnect() { return Boolean(this.ssid && this.password.length); }
  get waiting() { return ['scan','connecting','checking','downloading','installing','recovery'].includes(this.screen) || (this.screen==='wifi' && this.wifiStatus==='loading'); }
  get remaining() { return Math.max(0, 30-Math.floor(this.elapsed/1000)); }
  get pairingHint() { return this.screen==='scan' && this.elapsed>=10000; }
  goto(screen) { this.screen=screen; this.elapsed=0; this.history.push(screen); }
  beginScan() { this.connectionError=false; this.goto('scan'); }
  confirmPrompt() { if(this.screen==='start') this.beginScan(); }
  retryScan() { if(this.screen==='not-found') this.beginScan(); }
  back() {
    if(['start','scan','not-found'].includes(this.screen)) { this.online=false; this.goto('home'); }
    else if(this.screen==='wifi'&&!this.connectionError) this.beginScan();
  }
  openNetworks() {
    if(this.screen!=='wifi'||this.connectionError) return;
    this.wifiOpen=!this.wifiOpen;
    if(this.wifiOpen && this.scenario==='wifi-empty'&&!this.used.empty) { this.wifiStatus='empty'; this.used.empty=true; }
  }
  rescanNetworks() { if(this.screen==='wifi'&&this.wifiOpen&&this.wifiStatus!=='loading') {this.wifiStatus='loading';this.wifiElapsed=0;} }
  selectNetwork(ssid) {
    if(this.screen!=='wifi'||this.wifiStatus!=='ready'||!networks.includes(ssid)) return;
    if(this.ssid!==ssid) this.password='';
    this.ssid=ssid;this.wifiOpen=false;
  }
  connect() {
    if(this.screen!=='wifi'||!this.canConnect) return;
    this.connectionError=false;this.wifiOpen=false;this.goto('connecting');
  }
  cancelConnectionError() { this.connectionError=false; }
  checkUpdates() { if(this.screen==='connected') this.goto('checking'); }
  fail(kind) {this.error=kind;this.pending=true;this.goto('update-error');}
  retryUpdate() {
    if(this.screen!=='update-error') return;
    if(this.error==='check') this.goto('checking'); else this.goto('recovery');
  }
  later() { if(this.screen==='update-error') { this.pending=true;this.goto('home'); } }
  resume() { if(this.screen==='home'&&this.pending) this.goto('recovery'); }
  done() { if(this.screen==='complete') {this.password='';this.goto('home');} }
  restartFromHome() { if(this.screen==='home'&&!this.online&&!this.pending) this.goto('start'); }
  startScenario(scenario) {
    this.reset(scenario);
    if(['scan-timeout','delayed'].includes(scenario)) this.beginScan();
    if(scenario==='wifi-empty') {this.goto('wifi');this.openNetworks();}
    if(scenario==='wifi-failed') {this.goto('wifi');this.ssid=networks[0];}
    if(['no-update','check-failed'].includes(scenario)) {this.online=true;this.ssid=networks[0];this.goto('connected');}
    if(['wifi-unstable','corrupted','power-cut'].includes(scenario)) {
      this.online=true;this.pending=true;this.ssid=networks[0];
      this.devicePhase=scenario==='power-cut'?'installing':'downloading';
      this.goto(this.devicePhase);
    }
  }
  complete() {this.installed=true;this.online=true;this.pending=false;this.devicePhase='installed';this.goto('complete');}
  tick(ms) {
    if(!Number.isFinite(ms)||ms<0) return false;
    if(this.screen==='wifi'&&this.wifiStatus==='loading') {
      this.wifiElapsed+=ms;if(this.wifiElapsed>=1100) {this.wifiStatus='ready';return true;}return false;
    }
    if(!this.waiting) return false;
    this.elapsed+=ms;
    if(this.screen==='scan') {
      const shouldTimeout=this.scenario==='scan-timeout'&&!this.used.scan;
      const foundAfter=this.scenario==='delayed'?12000:3200;
      if(shouldTimeout&&this.elapsed>=30000) {this.used.scan=true;this.goto('not-found');}
      else if(!shouldTimeout&&this.elapsed>=foundAfter) {this.wifiOpen=false;this.goto('wifi');}
    } else if(this.screen==='connecting'&&this.elapsed>=2600) {
      if(this.scenario==='wifi-failed'&&!this.used.wifi) {this.used.wifi=true;this.goto('wifi');this.connectionError=true;}
      else {this.online=true;this.password='';this.goto('connected');}
    } else if(this.screen==='checking'&&this.elapsed>=1800) {
      this.devicePhase='checking';
      if(this.scenario==='check-failed'&&!this.used.check) {this.used.check=true;this.fail('check');}
      else if(this.scenario==='no-update') {this.installed=true;this.pending=false;this.goto('home');}
      else {this.pending=true;this.devicePhase='downloading';this.progress=0;this.goto('downloading');}
    } else if(this.screen==='downloading') {
      this.progress=Math.min(100,Math.floor(this.elapsed/80));
      if(this.scenario==='wifi-unstable'&&!this.used.network&&this.progress>=42) {this.used.network=true;this.fail('network');}
      else if(this.scenario==='corrupted'&&!this.used.corrupted&&this.progress>=98) {this.used.corrupted=true;this.fail('corrupted');}
      else if(this.progress>=100) {this.devicePhase='installing';this.goto('installing');}
    } else if(this.screen==='installing') {
      if(this.scenario==='power-cut'&&!this.used.power&&this.elapsed>=2800) {this.used.power=true;this.online=false;this.fail('power');}
      else if(this.elapsed>=5200) this.complete();
    } else if(this.screen==='recovery'&&this.elapsed>=1800) {
      this.online=true;
      const phase=this.error==='power'?this.recoveryResult:this.devicePhase;
      if(phase==='installed') this.complete();
      else if(phase==='checking') this.goto('checking');
      else {this.devicePhase=phase;this.progress=0;this.goto(phase);}
    }
    return true;
  }
}
