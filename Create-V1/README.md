# Create V1 · Journey in Me

A browser-local interactive prototype of the approved Create-v29 flows, styled with the supplied Paper Zen specification and the newer Home reference.

Open `dist/index.html` through a static HTTP server. Main entry: `#/home`. Release name: **Create V1**. Artwork review: `assets-review.html`.

## Scope

- Home reference and Create's Memory, Gift (three routes), Simple Card, Album, My Creativity and Explore.
- Required image / words / sound validation, templates, image selection and crop, MediaRecorder or clearly marked demo recording, sound drawer/full preview, mixing volume controls, icon playback, saved creations.
- Memory supports saved custom themes and custom subthemes, including source-specific recording copy.
- Gift preview has an eight-scene unboxing, card reveal/insertion and bedside sequence; pause, replay, skip, sound control, keyboard stepping and reduced-motion mode. Digital gifts use a shorter sequence without a physical speaker.
- Consistent press, focus, navigation, carousel, tab, selection and sheet transitions preserve context and respect reduced motion.
- Gift draft resume, copying personal creations into gifts, album selection (1–10), reorder, draft/resume and unified details.
- QR/share/export previews, image download, simulated Shopify return verification, simulated speaker/card-write states and error recovery.
- Data stays in localStorage. No remote account, upload, payment, hardware pairing, or public share backend. Share URLs only resolve in the same browser storage. Source sample audio reused across sounds; remaining background, sound-thumbnail and album artwork awaits review.

## Provenance

Approved Create flows and the current interactive implementation are preserved in this version.
Design reference: user-supplied Journey-in-Me-Paper-Zen-Design-Spec.docx and Home screenshot. New screenshot navigation takes precedence over older navigation in the spec.
Existing provided assets: speaker-transparent.png, mist-ambient.m4a. Lucide and QR Code Generator license notices preserved in dist/assets.

## Delivery

Static `dist/`, no runtime dependencies. Development dependency qrcode-generator provides the vendored QR utility. Custom app source is HTML/CSS/ES modules. Final artwork inventory is user-visible. Two ImageGen assets support the gift animation; the original speaker and current user card are composed at runtime. Exact prompts are in `gift-artwork-prompts.md`. No other batch artwork was generated.
