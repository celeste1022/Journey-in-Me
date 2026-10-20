# Unified Journey in Me

The release combines the original demos without rewriting their source files.

- `/` opens Home; legacy `/#/...` creation links redirect to `/create/#/...`.
- `/home/`, `/practice/`, `/create/#/create`, `/share/` are the four main tabs.
- Home profile opens `/my/`; My includes friends, creations, collection, orders and settings.
- Device completion returns to Home. My Speaker shows browser-local connection state, and pending firmware resumes on the next connection visit.
- Practice's existing reflection-to-card handoff and Share/My Friends' wish-list storage remain on the same origin.
- `/practice/create/` remains available for existing reflection and card detail overlays.

`navigation.js` connects the original navigation controls, including Home's nested document. It does not combine unrelated example datasets or turn simulated hardware, payments, friend invitations, or sharing into backend services.

Build from the `main` checkout and a current `My-friend` checkout:

```
python3 Integration/assemble.py . ../personal-source _site
python3 Integration/test_assembly.py . ../personal-source
```

The output directory must not already exist. Both branches' publishing workflows run the same assembly script from `main` so an update cannot accidentally publish only one demo. `personal-pages.yml` is the corresponding workflow for the `My-friend` branch.
