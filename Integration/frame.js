(() => {
  'use strict';
  const frame=document.querySelector('#journey-content');
  const content=new URL('content.html',location.href);
  content.search=location.search;content.hash=location.hash;
  // A My/Practice child is content inside the existing phone, never another phone.
  if(window!==window.top){location.replace(content.href);return;}
  const isCreate=/\/(?:practice\/)?create\/(?:index\.html)?$/.test(location.pathname);
  const updateNavigation=(hash=location.hash)=>{const route=hash.replace(/^#\/?/,'').split('?')[0];const immersive=isCreate&&!['','create','home'].includes(route);document.querySelector('.journey-phone').classList.toggle('journey-immersive',immersive);document.querySelector('.journey-nav').hidden=immersive;};
  updateNavigation();
  frame.src=content.href;
  window.addEventListener('hashchange',()=>{
    updateNavigation();try{frame.contentWindow.location.hash=location.hash;}catch{}
  });
  frame.addEventListener('load',()=>{
    try{
      const child=frame.contentWindow;
      // Share links and editor hashes remain reloadable at the original public URL.
      const sync=()=>{history.replaceState(null,'',location.pathname+location.search+child.location.hash);updateNavigation(child.location.hash);};sync();
      child.addEventListener('hashchange',sync);
      child.addEventListener('pagehide',()=>child.removeEventListener('hashchange',sync),{once:true});
    }catch{}
  });
})();
