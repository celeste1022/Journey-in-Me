"""Assemble all original demos and add common navigation, without modifying sources."""
from pathlib import Path
import shutil
import sys
import html
import re
from frame import apply_frames


def assemble(main, personal, target):
    main, personal, target = map(Path, (main, personal, target))
    if target.exists():
        raise SystemExit(f'Output already exists: {target}')
    target.mkdir(parents=True)
    for source, destination in [(main/'Create-V1/dist','create'),(main/'Speaker-Connection/dist','connect-device'),(personal/'Practice','practice'),(personal/'My','my')]:
        shutil.copytree(source,target/destination)
    for source, destination in [(main/'Share-V4/index.html','share/index.html'),(personal/'Home/index.html','home/index.html'),(personal/'My-friend/index.html','my-friend/index.html')]:
        dest=target/destination
        dest.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(source,dest)
    shutil.copytree(personal/'My-friend/reminder-options',target/'my-friend/reminder-options')
    # Practice's reflection-to-card and My Creativity use this legacy embedded URL.
    shutil.copytree(main/'Create-V1/dist',target/'practice/create',dirs_exist_ok=True)
    shutil.copy2(main/'Integration/navigation.js',target/'journey-navigation.js')
    # Route completion through the shared Home; keep the device status available to My.
    speaker=target/'connect-device/app.mjs'
    text=speaker.read_text()
    text=text.replace("function render(){", "function render(){\n  if(flow.screen==='home'){try{localStorage.setItem('journey-device',JSON.stringify({online:flow.online,pending:flow.pending,ssid:flow.ssid,installed:flow.installed,devicePhase:flow.devicePhase,error:flow.error}));}catch{} location.assign('../home/');return;}\n")
    if text==speaker.read_text():
        raise SystemExit('Speaker render integration point changed')
    text=text.replace("const flow=new ConnectionFlow();", """const flow=new ConnectionFlow();
try{const device=JSON.parse(localStorage.getItem('journey-device'));if(device?.pending){Object.assign(flow,device);flow.goto('recovery');}}catch{}
""")
    speaker.write_text(text)
    my=target/'my/my.js'
    text=my.read_text().replace("creativity:'../practice/create/?from=my#/library'", "creativity:'../create/?from=my#/library'")
    old="function speaker(){return '<h2>My Speaker</h2><p>Connect your speaker to get started.</p><a class=\"primary\" style=\"text-align:center;text-decoration:none\" href=\"../connect-device/\">Connect</a>'}"
    new="""function speaker(){let device;try{device=JSON.parse(localStorage.getItem('journey-device'))}catch{}return '<h2>My Speaker</h2><p>'+(device?.online?'Connected · '+esc(device.ssid||'Your speaker'):'Connect your speaker to get started.')+'</p>'+(device?.pending?'<p>Firmware update pending.</p>':'')+'<a class="primary" style="text-align:center;text-decoration:none" href="../connect-device/">'+(device?.pending?'Resume connection':device?.online?'Connect again':'Connect')+'</a>'}"""
    if old not in text:
        raise SystemExit('My speaker integration point changed')
    text=text.replace(old,new)
    my.write_text(text)
    # Home intentionally isolates its srcdoc and permits inline scripts only.
    # Connect it through a small allowlisted message bridge, preserving its sandbox/CSP.
    home=target/'home/index.html'
    home_text=home.read_text().replace("else location.href='../my/'","else window.top.location.href='../my/'")
    match=re.search(r'srcdoc="([\s\S]*?)"\s*>',home_text)
    if not match:
        raise SystemExit('Home srcdoc integration point changed')
    inner=html.unescape(match.group(1))
    bridge="""<script>
(() => { const names=['home','practice','create','share'];
 document.querySelectorAll('.hj-nav-item').forEach((el,i)=>{
 el.setAttribute('role','link');el.tabIndex=0;el.style.cursor='pointer';
 const open=()=>parent.postMessage({channel:'journey-navigate',route:names[i]},'*');
 el.addEventListener('click',open);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
 });
})();
</script>"""
    inner=inner.replace('</body>',bridge+'</body>')
    home_text=home_text[:match.start(1)]+html.escape(inner,quote=True)+home_text[match.end(1):]
    receiver="""<script>
window.addEventListener('message',e=>{const f=document.querySelector('iframe');if(e.source!==f.contentWindow||e.data?.channel!=='journey-navigate')return;const urls={home:'../home/',practice:'../practice/',create:'../create/#/create',share:'../share/'};const url=urls[e.data.route];if(url)window.top.location.assign(new URL(url,location.href).href);});
</script>"""
    home.write_text(home_text.replace('</body>',receiver+'</body>'))
    for page in target.rglob('*.html'):
        relative='../'*len(page.relative_to(target).parts[:-1])
        content=page.read_text()
        # Append after module initialization (defer classic script until parsing is done).
        tag=f'<script defer src="{relative}journey-navigation.js"></script>'
        content=content.replace('</body>',tag+'</body>') if '</body>' in content else content+tag
        page.write_text(content)
    (target/'index.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Journey in Me</title><body><a href="home/">Enter Journey in Me</a><script>
const hash=location.hash;
const legacy=hash.startsWith('#/')&&hash!=='#/home';
location.replace(legacy?'create/'+location.search+hash:'home/'+location.search);
</script></body></html>''')
    # Support the former root asset review link.
    (target/'assets-review.html').write_text('<meta http-equiv="refresh" content="0;url=create/assets-review.html">')
    (target/'.nojekyll').touch()
    apply_frames(target, main/'Integration')

if __name__=='__main__':
    assemble(*sys.argv[1:])
