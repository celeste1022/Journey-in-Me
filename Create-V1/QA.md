# Create demo verification — 2026-09-20

Verified in the actual in-app browser using visible controls, with additional 390 × 844 layout inspection.

- Memory theme → subtheme → swipeable template → editor → artist image → required words → source-specific recording copy.
- Sequential disabled states: recording adopted → Add a Sound enabled → sound selected → Mixer enabled → saved mix → Done enabled.
- Sound bottom tray expands to fullscreen; real demo-audio playback changes play to pause, with scrub/rewind/forward.
- Create my cards → saved card detail with icon playback; native share/export views render QR.
- Gift card route selects a card and an album together; confirmation creates gift summary; share represents entire gift.
- Gift set speaker → summary directly, Bazaar preview → album detail → Confirm returns to summary; blessing card uses Gift recording title; creating card returns to summary.
- Simulated checkout unverified result → Check again → success → returns to original gift. No actual payment.
- Album selection/reordering/saving, no-intro case, card-detail return, and refresh persistence.
- Create a new card from album → choose local PNG through native file chooser → crop → sound steps → generate → prominent Back to Album creation → selected new card retained.
- 10-card limit prevents an 11th selection and keeps selected state.
- My Creativity Album/Drafts empty state retains both categories and Create a Card, without a popup.
- Explore details omit Edit and destructive options; own details display Edit plus the unified toolbar.
- Simulated disconnected speaker rejects writing; connection → insert → ready → progress → completed works.
- Page WebMCP valid navigation succeeds, invalid section rejected without transition.
- JavaScript syntax validated for app.js, audio.js and data.js.

One runtime defect found during QA (null album intro on save) was fixed and the affected save, return and refresh path retested successfully. Additional source checks address gifted-copy editing and preserved album snapshots.

Not exercised: accepting actual microphone permission / capturing live user audio; OS share integrations; real payment; physical Bluetooth/NFC writes. The last two are explicitly simulations. Shared URLs are local browser snapshots, not public hosted audio links.

Artwork is intentionally incomplete: four approved abstract color studies are reused, actual provided speaker asset is retained, other hardware views are labeled placeholders. Gift animation and polished interaction motion are now included; the remaining background and cover artwork is still a subsequent review stage.

## Gift motion and interaction update

- Custom Memory theme: blank-name error; create theme; add a custom moment; choose template; recording page displays both custom names; return through the flow and refresh retains names.
- Gift set: eight-scene sequence advances through the complete timeline and ends with Replay; pause/continue, replay, skip, mute control and reduced-motion stepping have visible states.
- Reduced-motion audio: Play your sound changes to Pause sound, and can be stopped independently.
- Returning from gift preview goes to gift summary; summary returns to the gift type selection without looping back into the preview. Leaving the view disposes its timeline and pauses the sound player.
- Digital gift uses four scenes and the selected card title/artwork; does not show a physical speaker.
- Multi-select preserves the bottom-of-list scroll position and focused card after selection.
- Album sorting now uses a large menu target; Move earlier changes order; boundary actions are disabled.
- Keyboard arrow switches creation tabs; focus tracks the selected tab.
- Gift scenes inspected at the default viewport and 390 × 844; card reveal, insertion and bedside composition adjusted after visual review. Controls have 44–48 px targets, and full narration stays visible on the tested phone viewport.
- Browser console had no app errors during these flows. Syntax checks cover all changed modules.

Gift images were generated with the built-in ImageGen tool, using prompts retained in gift-artwork-prompts.md. UI compositions use the supplied speaker and the selected creation. Actual live microphone recording was not requested or re-tested in this update.

## Card submission feedback fix

- Reproduced the reported issue: a top-of-page validation message existed while the editor viewport remained at the bottom, so no warning was visible next to the Create action.
- Shared editor now validates all required fields together; field messages and the fixed action-area summary remain visible until corrected. Focus/scroll targets the first incomplete field.
- In-browser checks: fully empty form, whitespace-only words, photo missing, recording missing, background missing, and mix unsaved all remain in the editor; completed-creation count stays unchanged.
- Filling fields clears only the corresponding error; returning from image/sound selection updates validation without losing text.
- Completed required content submits by Enter, generates a detail preview, and increases the completed-card count once (15 to 16 in the local test).
- Repeated the user's Memory → A moment → A small detail from everyday life → template → Create route at 390 × 844. Three missing fields are highlighted, Photo receives focus, and the footer lists Photo, Words to write down, and Sound of The Moment.
- Four domain checks pass for whitespace, false completion state, partial completion, and all shared editor sources. Browser console contains no app errors in the tested flow.
