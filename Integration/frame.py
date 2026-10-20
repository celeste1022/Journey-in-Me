"""One shared phone, status bar, navigation and safe area for every public module."""
from pathlib import Path
import html
import re
import json

PATHS={
 'Home':'<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',
 'Practice':'<path d="M12 21V11M12 15C3 15 3 6 3 6s9-1 9 9ZM12 12c0-8 9-9 9-9s1 9-9 9Z"/>',
 'Create':'<path d="M12 5v14M5 12h14"/><rect x="3" y="3" width="18" height="18" rx="5"/>',
 'Share':'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m9 10 6-4M9 14l6 4"/>'
}
ROUTES={'home':'Home','practice':'Practice','create':'Create','share':'Share','my':'My','my-friend':'My Friends','connect-device':'Connect Device'}

def wrapper(module, prefix='../'):
    active=module if module in ['home','practice','create','share'] else ('share' if module=='my-friend' else 'home')
    nav=''.join(f'<a href="{prefix}{key}/'+('#/create' if key=='create' else '')+'"'+(' aria-current="page"' if active==key else '')+f'><svg viewBox="0 0 24 24" aria-hidden="true">{PATHS[label]}</svg><span>{label}</span></a>' for key,label in list(ROUTES.items())[:4])
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#f6f6f2"><title>{ROUTES[module]} · Journey in Me</title><link rel="stylesheet" href="{prefix}journey-frame.css?v=1"></head><body>
<main class="journey-phone" aria-label="Journey in Me mobile app">
<div class="journey-status" aria-hidden="true"><span>9:41</span><span class="journey-status-icons"><svg viewBox="0 0 24 24"><path d="M4 20v-4M9 20v-8M14 20V8M19 20V4"/></svg><svg viewBox="0 0 24 24"><path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="20" r=".5"/></svg><svg viewBox="0 0 28 24"><rect x="2" y="7" width="21" height="11" rx="2"/><path d="M25 10v5"/><path d="M5 10h15v5H5Z" fill="currentColor" stroke="none"/></svg></span></div>
<iframe id="journey-content" class="journey-content" title="{ROUTES[module]}" allow="microphone" referrerpolicy="same-origin"></iframe>
<nav class="journey-nav" aria-label="Main navigation">{nav}</nav></main><script src="{prefix}journey-frame.js?v=1"></script></body></html>'''

def apply_frames(target, integration):
    target, integration=Path(target),Path(integration)
    embedded=(integration/'embedded.css').read_text()
    # Same-origin feature dialogs also receive the content-only layout on load.
    navigation=target/'journey-navigation.js'
    script=navigation.read_text()
    script=script.replace("const style=doc.createElement('style');", "const style=doc.createElement('style');style.dataset.journeyContent='true';")
    script=script.replace('doc.head.append(style);', 'style.textContent+='+json.dumps(embedded)+';doc.head.append(style);')
    navigation.write_text(script)
    for source,dest in [('frame.css','journey-frame.css'),('frame.js','journey-frame.js')]:
        (target/dest).write_text((integration/source).read_text())
    for module in ROUTES:
        page=target/module/'index.html'
        content=page.read_text()
        # Home keeps its opaque sandbox and CSP; inject only allowed inline layout CSS.
        if module=='home':
            match=re.search(r'srcdoc="([\s\S]*?)"\s*>',content)
            inner=html.unescape(match.group(1))
            inner=inner.replace('</head>','<style>'+embedded+'</style></head>')
            content=content[:match.start(1)]+html.escape(inner,quote=True)+content[match.end(1):]
            content=content.replace('</head>','<style>html,body{margin:0!important;padding:0!important;height:100%;overflow:hidden}body>iframe{display:block!important;width:100%!important;height:100dvh!important;border:0!important}</style></head>')
        else:
            content=content.replace('<html',f'<html data-journey-module="{module}"',1)
            style='<style>'+embedded+'</style>'
            # Some original prototypes omit head/body tags.
            if '</head>' in content: content=content.replace('</head>',style+'</head>',1)
            else: content=content.replace('<body>',style+'<body>',1) if '<body>' in content else style+content
        (target/module/'content.html').write_text(content)
        page.write_text(wrapper(module))
    # Preserve the reflection-to-card embedded entry, without a nested phone shell.
    legacy=target/'practice/create/index.html'
    content=legacy.read_text().replace('</head>','<style>'+embedded+'</style></head>',1)
    legacy.write_text(content)
    for app in [target/'create/app.js',target/'practice/create/app.js']:
        script=app.read_text().replace("location.origin+location.pathname+'#/public-card", "location.origin+location.pathname.replace(/content\\.html$/,'')+'#/public-card")
        app.write_text(script)
