"""Check the combined release and preserve original demo source files."""
import sys
import html
import re
import tempfile
from pathlib import Path
from assemble import assemble

main, personal = map(Path, sys.argv[1:])
original = (main/'Create-V1/dist/index.html').read_bytes()
with tempfile.TemporaryDirectory() as temp:
    out=Path(temp)/'site'
    assemble(main,personal,out)
    for route in ['home','practice','create','share','my','my-friend','connect-device','practice/create']:
        page=out/route/'index.html'
        assert page.is_file(),route
        assert 'journey-navigation.js' in page.read_text(),route
    home=(out/'home/index.html').read_text()
    assert 'sandbox="allow-scripts"' in home
    assert "channel:'journey-navigate'" in html.unescape(home)
    inner=html.unescape(re.search(r'srcdoc="([\s\S]*?)"\s*>',home).group(1))
    assert "el.setAttribute('role','link')" in inner
    assert "e.source!==f.contentWindow" in home
    assert (out/'create/assets/mist-ambient.m4a').is_file()
    assert (out/'practice/create/assets/mist-ambient.m4a').is_file()
    assert (out/'my-friend/reminder-options/index.html').is_file()
    assert "location.replace(legacy?" in (out/'index.html').read_text()
    assert "location.assign('../home/')" in (out/'connect-device/app.mjs').read_text()
    assert "flow.goto('recovery')" in (out/'connect-device/app.mjs').read_text()
    assert "creativity:'../create/?from=my#/library'" in (out/'my/my.js').read_text()
    assert "journey-device" in (out/'my/my.js').read_text()
assert (main/'Create-V1/dist/index.html').read_bytes()==original
print('Integration: all 7 modules, legacy URLs, device handoff and original assets verified')
