# Interaction review — Paper Zen Create Demo

Review basis: supplied Paper Zen specification, approved Create flows, and Apple Human Interface Guidelines. This is an interactive web demo; the brand typography, paper palette and restrained borders are retained.

## Fixed

- P1 · Small carousel dots, arrow controls, sound-tray handles, progress sliders and dense reorder controls were hard to tap. Interactive targets are now at least 44 px in the audited surfaces; small visual marks sit within larger targets. Album reorder uses a single menu per card.
- P1 · A selection rerender could lose scroll/focus, and returning from a nested flow could bounce back into that flow. Same-page changes preserve scroll and focus; explicit Memory, photo, Sound and Gift return paths preserve context.
- P1 · Motion had no consistent vocabulary. Press feedback is 140 ms, changed surfaces and tabs 240 ms, route transitions 280 ms, and card flips 420 ms. Motion follows actions, with no constant decorative UI movement.
- P1 · Keyboard and reduced-motion behavior were incomplete. Visible focus, arrow-key category changes and native labeled dialogs are provided. The operating-system reduced-motion preference suppresses spatial UI transitions; the gift preview offers static, user-stepped scenes and separate sound playback.
- P2 · Secondary input type was small and details had duplicate action emphasis. Inputs are 16 px, supporting text spacing is consistent, main actions remain prominent, and duplicate album More control is removed.
- P2 · Gift preview did not tell the delivery story. The sequence now moves from parcel to gift box, unwraps, reveals the current card, inserts it into the supplied speaker, plays its sound and settles into a bedside scene. Pause, replay, skip, mute and reduced motion are available. Digital-only gifts use four scenes without hardware.

## Verification

See QA.md for executed browser paths and limitations. Visual review found and corrected a clipped card reveal and responsive speaker placement. Existing unrelated prototype integrations (payment, hardware, public sharing) retain their original demo scope.

## References

- [Apple UI design tips](https://developer.apple.com/design/tips/)
- [Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
