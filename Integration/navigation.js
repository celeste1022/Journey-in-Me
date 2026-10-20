/* Shared navigation for the original, same-origin Journey in Me demos. */
(() => {
  'use strict';
  const base = new URL('./', document.currentScript.src);
  const routes = {home:'home/', practice:'practice/', create:'create/#/create', share:'share/', my:'my/', friends:'my-friend/', speaker:'connect-device/', reflection:'practice/?entry=reflection'};
  function navigate(name) {
    const dest = new URL(routes[name], base);
    if (window.top.location.href !== dest.href) window.top.location.assign(dest.href);
  }
  function install(win) {
    let doc;
    try { doc = win.document; if (doc.documentElement.dataset.journeyNavigation) return; } catch { return; }
    doc.documentElement.dataset.journeyNavigation = 'ready';
    const style=doc.createElement('style');
    style.textContent='.hj-nav-item{cursor:pointer}.hj-nav-item:focus-visible{outline:2px solid #34543d;outline-offset:4px}';
    doc.head.append(style);
    function prepare() {
      doc.querySelectorAll('.hj-nav-item').forEach(el=>{el.setAttribute('role','link');el.tabIndex=0;el.removeAttribute('aria-disabled');});
      doc.querySelectorAll('iframe').forEach(frame=>{
        if(!frame.dataset.journeyWatched){frame.dataset.journeyWatched='1';frame.addEventListener('load',()=>install(frame.contentWindow));}
        if(frame.contentDocument?.readyState==='complete')install(frame.contentWindow);
      });
    }
    function onClick(e) {
      const el=e.target.closest?.('a,button,.hj-nav-item,[role="tab"]');
      if(!el)return;
      let dest;
      const nav=el.closest('.bottom-nav,.hj-nav,#nav,.nav[role="tablist"],nav.nav');
      if(nav) {
        const label=(el.textContent||'').trim().toLowerCase();
        dest=({home:'home',practice:'practice',create:'create',share:'share'})[label];
      }
      if(el.matches('.hot'))dest=({Home:'home',Practice:'practice',Create:'create',Share:'share'})[el.getAttribute('aria-label')]||dest;
      const go=el.getAttribute('data-go');
      if(go==='friends')dest='friends';
      if(go==='reflection')dest='reflection';
      if(go==='home')dest='home';
      if(go==='share-hub')dest='share';
      if(go==='practice')dest='practice';
      if(el.matches('.wordmark'))dest='home';
      // Keep local navigation within the active module, including its unsaved state.
      const path=win.top.location.pathname;
      if(dest&&!(dest==='create'&&path===new URL('create/',base).pathname)&&!(dest==='practice'&&path===new URL('practice/',base).pathname)&&!(dest==='share'&&path===new URL('share/',base).pathname)&&!(dest==='home'&&path===new URL('home/',base).pathname)){
        e.preventDefault();e.stopImmediatePropagation();navigate(dest);return;
      }
      if(el.tagName==='A') {
        const url=new URL(el.getAttribute('href')||'',win.location.href==='about:srcdoc'?base:win.location.href);
        if(url.origin===base.origin&&url.pathname.startsWith(base.pathname)&&/\/(home|practice|create|share|my|my-friend|connect-device)\//.test(url.pathname)&&win!==window.top){
          e.preventDefault();e.stopImmediatePropagation();window.top.location.assign(url.href);
        }
      }
    }
    doc.addEventListener('click',onClick,true);
    doc.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.hj-nav-item')){e.preventDefault();e.target.click();}});
    let scheduled=false;
    new win.MutationObserver(()=>{if(!scheduled){scheduled=true;win.queueMicrotask(()=>{scheduled=false;prepare();});}}).observe(doc.body,{childList:true,subtree:true});
    prepare();
  }
  install(window);
  if(location.pathname===new URL('practice/',base).pathname&&new URLSearchParams(location.search).get('entry')==='reflection') {
    if(typeof window.prepareToday==='function'&&typeof window.show==='function'){window.prepareToday();window.show('01a-writing-0');}
  }
})();
