"""Check the combined release and preserve original demo source files."""
import sys
import tempfile
from pathlib import Path
from assemble import assemble

main, personal = map(Path, sys.argv[1:])
original = (main/'Create-V1/dist/index.html').read_bytes()
with tempfile.TemporaryDirectory() as temp:
    out=Path(temp)/'site'
    assemble(main,personal,out)
    for route in ['home','practice','create','share','my','my-friend','connect-device','practice/create']:
        html=out/route/'index.html'
        assert html.is_file(),route
        assert 'journey-navigation.js' in html.read_text(),route
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
